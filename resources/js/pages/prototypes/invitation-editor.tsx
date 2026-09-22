import { Head } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    ChevronDown,
    ChevronRight,
    CircleHelp,
    Eye,
    Image as ImageIcon,
    Layers3,
    Link2,
    LockKeyhole,
    MousePointer2,
    MoveVertical,
    Plus,
    Redo2,
    Save,
    Settings2,
    SquareStack,
    Trash2,
    Type,
    Undo2,
} from 'lucide-react';
import {
    useEffect,
    useMemo,
    useReducer,
    useState,
    type ReactNode,
} from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

type BlockKind = 'text' | 'image' | 'button';
type Viewport = 'desktop' | 'tablet' | 'mobile';
type SaveState = 'saved' | 'unsaved';

type Block = {
    id: string;
    kind: BlockKind;
    content: string;
    label: string;
    alt?: string;
    href?: string;
};

type ContainerNode = {
    id: string;
    label: string;
    blocks: Block[];
};

type SectionNode = {
    id: string;
    label: string;
    containers: ContainerNode[];
};

type DesignDocument = {
    schemaVersion: 1;
    sections: SectionNode[];
};

type Selection =
    | { kind: 'section'; id: string }
    | { kind: 'container'; id: string }
    | { kind: 'block'; id: string }
    | null;

type EditorState = {
    document: DesignDocument;
    selected: Selection;
    viewport: Viewport;
    saveState: SaveState;
};

type EditorAction =
    | { type: 'select'; selection: Selection }
    | { type: 'setViewport'; viewport: Viewport }
    | { type: 'addSection' }
    | { type: 'addBlock'; kind: BlockKind }
    | { type: 'updateBlock'; id: string; changes: Partial<Block> }
    | { type: 'duplicateBlock'; id: string }
    | { type: 'removeBlock'; id: string }
    | { type: 'moveBlock'; id: string; direction: 'up' | 'down' }
    | { type: 'duplicateSection'; id: string }
    | { type: 'removeSection'; id: string }
    | { type: 'moveSection'; id: string; direction: 'up' | 'down' }
    | { type: 'save' };

const initialDocument: DesignDocument = {
    schemaVersion: 1,
    sections: [
        {
            id: 'section-welcome',
            label: 'Welcome',
            containers: [
                {
                    id: 'container-welcome',
                    label: 'Welcome content',
                    blocks: [
                        {
                            id: 'block-couple-name',
                            kind: 'text',
                            label: 'Couple names',
                            content: 'Raka & Aulia',
                        },
                        {
                            id: 'block-welcome-copy',
                            kind: 'text',
                            label: 'Welcome copy',
                            content:
                                'Dengan penuh kebahagiaan, kami mengundang Anda untuk merayakan hari istimewa kami.',
                        },
                        {
                            id: 'block-see-invitation',
                            kind: 'button',
                            label: 'See invitation button',
                            content: 'Lihat undangan',
                            href: '#details',
                        },
                    ],
                },
            ],
        },
        {
            id: 'section-story',
            label: 'Our story',
            containers: [
                {
                    id: 'container-story',
                    label: 'Story content',
                    blocks: [
                        {
                            id: 'block-story-copy',
                            kind: 'text',
                            label: 'Story copy',
                            content:
                                'Satu cerita, dua hati, dan perjalanan yang ingin kami rayakan bersama orang-orang terkasih.',
                        },
                        {
                            id: 'block-story-image',
                            kind: 'image',
                            label: 'Story image',
                            content: 'Personal photo placeholder',
                            alt: 'A placeholder for a personal couple photo',
                        },
                    ],
                },
            ],
        },
        {
            id: 'section-details',
            label: 'Event details',
            containers: [
                {
                    id: 'container-details',
                    label: 'Event content',
                    blocks: [
                        {
                            id: 'block-event-copy',
                            kind: 'text',
                            label: 'Event details copy',
                            content:
                                'Sabtu, 12 Oktober 2026 · Gedung Serbaguna Jakarta',
                        },
                    ],
                },
            ],
        },
    ],
};

let generatedId = 0;

function createId(prefix: string): string {
    generatedId += 1;

    return `${prefix}-${generatedId}`;
}

function createBlock(kind: BlockKind): Block {
    const defaults: Record<BlockKind, Omit<Block, 'id'>> = {
        text: {
            kind: 'text',
            label: 'New text block',
            content: 'Tulis konten undangan di sini.',
        },
        image: {
            kind: 'image',
            label: 'New image block',
            content: 'Personal photo placeholder',
            alt: 'A personal photo',
        },
        button: {
            kind: 'button',
            label: 'New button block',
            content: 'Button label',
            href: 'https://example.com',
        },
    };

    return {
        id: createId('block'),
        ...defaults[kind],
    };
}

function updateDocument(
    state: EditorState,
    document: DesignDocument,
    selected: Selection = state.selected,
): EditorState {
    return {
        ...state,
        document,
        selected,
        saveState: 'unsaved',
    };
}

function findBlockLocation(document: DesignDocument, id: string) {
    for (const [sectionIndex, section] of document.sections.entries()) {
        for (const [
            containerIndex,
            container,
        ] of section.containers.entries()) {
            const blockIndex = container.blocks.findIndex(
                (block) => block.id === id,
            );

            if (blockIndex !== -1) {
                return { sectionIndex, containerIndex, blockIndex };
            }
        }
    }

    return null;
}

function findContainerLocation(document: DesignDocument, id: string) {
    for (const [sectionIndex, section] of document.sections.entries()) {
        const containerIndex = section.containers.findIndex(
            (container) => container.id === id,
        );

        if (containerIndex !== -1) {
            return { sectionIndex, containerIndex };
        }
    }

    return null;
}

function findSectionIndex(document: DesignDocument, id: string): number {
    return document.sections.findIndex((section) => section.id === id);
}

function selectedContainerLocation(
    document: DesignDocument,
    selected: Selection,
) {
    if (selected?.kind === 'container') {
        return findContainerLocation(document, selected.id);
    }

    if (selected?.kind === 'block') {
        const location = findBlockLocation(document, selected.id);

        if (location) {
            return {
                sectionIndex: location.sectionIndex,
                containerIndex: location.containerIndex,
            };
        }
    }

    if (selected?.kind === 'section') {
        const sectionIndex = findSectionIndex(document, selected.id);

        if (sectionIndex !== -1) {
            return { sectionIndex, containerIndex: 0 };
        }
    }

    return document.sections[0] ? { sectionIndex: 0, containerIndex: 0 } : null;
}

function cloneSection(section: SectionNode): SectionNode {
    return {
        ...section,
        id: createId('section'),
        label: `${section.label} copy`,
        containers: section.containers.map((container) => ({
            ...container,
            id: createId('container'),
            blocks: container.blocks.map((block) => ({
                ...block,
                id: createId('block'),
            })),
        })),
    };
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
    switch (action.type) {
        case 'select':
            return { ...state, selected: action.selection };
        case 'setViewport':
            return { ...state, viewport: action.viewport };
        case 'addSection': {
            const section: SectionNode = {
                id: createId('section'),
                label: `New section ${state.document.sections.length + 1}`,
                containers: [
                    {
                        id: createId('container'),
                        label: 'New container',
                        blocks: [],
                    },
                ],
            };

            return updateDocument(
                state,
                {
                    ...state.document,
                    sections: [...state.document.sections, section],
                },
                { kind: 'section', id: section.id },
            );
        }
        case 'addBlock': {
            const location = selectedContainerLocation(
                state.document,
                state.selected,
            );

            if (!location) {
                return state;
            }

            const block = createBlock(action.kind);
            const sections = state.document.sections.map((section, index) => {
                if (index !== location.sectionIndex) {
                    return section;
                }

                return {
                    ...section,
                    containers: section.containers.map((container, index) =>
                        index === location.containerIndex
                            ? {
                                  ...container,
                                  blocks: [...container.blocks, block],
                              }
                            : container,
                    ),
                };
            });

            return updateDocument(
                state,
                { ...state.document, sections },
                { kind: 'block', id: block.id },
            );
        }
        case 'updateBlock': {
            const sections = state.document.sections.map((section) => ({
                ...section,
                containers: section.containers.map((container) => ({
                    ...container,
                    blocks: container.blocks.map((block) =>
                        block.id === action.id
                            ? { ...block, ...action.changes }
                            : block,
                    ),
                })),
            }));

            return updateDocument(state, { ...state.document, sections });
        }
        case 'duplicateBlock': {
            const location = findBlockLocation(state.document, action.id);

            if (!location) {
                return state;
            }

            const source =
                state.document.sections[location.sectionIndex].containers[
                    location.containerIndex
                ].blocks[location.blockIndex];
            const duplicate = {
                ...source,
                id: createId('block'),
                label: `${source.label} copy`,
            };
            const sections = state.document.sections.map((section, index) => {
                if (index !== location.sectionIndex) {
                    return section;
                }

                return {
                    ...section,
                    containers: section.containers.map((container, index) => {
                        if (index !== location.containerIndex) {
                            return container;
                        }

                        const blocks = [...container.blocks];
                        blocks.splice(location.blockIndex + 1, 0, duplicate);

                        return { ...container, blocks };
                    }),
                };
            });

            return updateDocument(
                state,
                { ...state.document, sections },
                { kind: 'block', id: duplicate.id },
            );
        }
        case 'removeBlock': {
            const sections = state.document.sections.map((section) => ({
                ...section,
                containers: section.containers.map((container) => ({
                    ...container,
                    blocks: container.blocks.filter(
                        (block) => block.id !== action.id,
                    ),
                })),
            }));

            return updateDocument(state, { ...state.document, sections }, null);
        }
        case 'moveBlock': {
            const location = findBlockLocation(state.document, action.id);

            if (!location) {
                return state;
            }

            const section = state.document.sections[location.sectionIndex];
            const container = section.containers[location.containerIndex];
            const nextIndex =
                action.direction === 'up'
                    ? location.blockIndex - 1
                    : location.blockIndex + 1;

            if (nextIndex < 0 || nextIndex >= container.blocks.length) {
                return state;
            }

            const blocks = [...container.blocks];
            [blocks[location.blockIndex], blocks[nextIndex]] = [
                blocks[nextIndex],
                blocks[location.blockIndex],
            ];
            const sections = state.document.sections.map((item, index) =>
                index === location.sectionIndex
                    ? {
                          ...item,
                          containers: item.containers.map((item, index) =>
                              index === location.containerIndex
                                  ? { ...item, blocks }
                                  : item,
                          ),
                      }
                    : item,
            );

            return updateDocument(state, { ...state.document, sections });
        }
        case 'duplicateSection': {
            const index = findSectionIndex(state.document, action.id);

            if (index === -1) {
                return state;
            }

            const duplicate = cloneSection(state.document.sections[index]);
            const sections = [...state.document.sections];
            sections.splice(index + 1, 0, duplicate);

            return updateDocument(
                state,
                { ...state.document, sections },
                { kind: 'section', id: duplicate.id },
            );
        }
        case 'removeSection': {
            if (state.document.sections.length <= 1) {
                return state;
            }

            const sections = state.document.sections.filter(
                (section) => section.id !== action.id,
            );

            return updateDocument(state, { ...state.document, sections }, null);
        }
        case 'moveSection': {
            const index = findSectionIndex(state.document, action.id);
            const nextIndex = action.direction === 'up' ? index - 1 : index + 1;

            if (
                index === -1 ||
                nextIndex < 0 ||
                nextIndex >= state.document.sections.length
            ) {
                return state;
            }

            const sections = [...state.document.sections];
            [sections[index], sections[nextIndex]] = [
                sections[nextIndex],
                sections[index],
            ];

            return updateDocument(state, { ...state.document, sections });
        }
        case 'save':
            return { ...state, saveState: 'saved' };
    }
}

const initialState: EditorState = {
    document: initialDocument,
    selected: { kind: 'block', id: 'block-couple-name' },
    viewport: 'desktop',
    saveState: 'saved',
};

const viewportWidths: Record<Viewport, string> = {
    desktop: 'min-h-[680px] w-full',
    tablet: 'min-h-[680px] w-[680px] max-w-full',
    mobile: 'min-h-[680px] w-[390px] max-w-full',
};

const viewportLabels: Record<Viewport, string> = {
    desktop: 'Desktop',
    tablet: 'Tablet',
    mobile: 'Mobile',
};

function blockIcon(kind: BlockKind) {
    if (kind === 'text') {
        return Type;
    }

    if (kind === 'image') {
        return ImageIcon;
    }

    return Link2;
}

function blockKindLabel(kind: BlockKind): string {
    return kind === 'text' ? 'Text' : kind === 'image' ? 'Image' : 'Button';
}

function findBlock(document: DesignDocument, id: string): Block | null {
    for (const section of document.sections) {
        for (const container of section.containers) {
            const block = container.blocks.find((item) => item.id === id);

            if (block) {
                return block;
            }
        }
    }

    return null;
}

function countBlocks(document: DesignDocument): number {
    return document.sections.reduce(
        (total, section) =>
            total +
            section.containers.reduce(
                (containerTotal, container) =>
                    containerTotal + container.blocks.length,
                0,
            ),
        0,
    );
}

function PanelHeading({
    eyebrow,
    title,
    action,
}: {
    eyebrow: string;
    title: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    {eyebrow}
                </p>
                <h2 className="text-sm font-semibold tracking-tight">
                    {title}
                </h2>
            </div>
            {action}
        </div>
    );
}

function BlockPalette({
    onAddBlock,
}: {
    onAddBlock: (kind: BlockKind) => void;
}) {
    const blocks: Array<{ kind: BlockKind; description: string }> = [
        { kind: 'text', description: 'Headings and invitation copy' },
        { kind: 'image', description: 'Personal photos and artwork' },
        { kind: 'button', description: 'Links and actions' },
    ];

    return (
        <div className="space-y-3">
            <PanelHeading
                eyebrow="Insert"
                title="Content blocks"
                action={<Plus className="size-4 text-muted-foreground" />}
            />
            <div className="space-y-2">
                {blocks.map(({ kind, description }) => {
                    const Icon = blockIcon(kind);

                    return (
                        <button
                            className="group flex w-full items-center gap-3 rounded-lg border border-border/70 bg-background p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent"
                            key={kind}
                            onClick={() => onAddBlock(kind)}
                            type="button"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <Icon className="size-4" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-sm font-medium">
                                    {blockKindLabel(kind)}
                                </span>
                                <span className="block truncate text-xs text-muted-foreground">
                                    {description}
                                </span>
                            </span>
                            <Plus className="ml-auto size-4 text-muted-foreground" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function DocumentOutline({
    document,
    selected,
    dispatch,
}: {
    document: DesignDocument;
    selected: Selection;
    dispatch: React.Dispatch<EditorAction>;
}) {
    return (
        <div className="space-y-3">
            <PanelHeading
                eyebrow="Structure"
                title="Page outline"
                action={
                    <Button
                        aria-label="Add section"
                        onClick={() => dispatch({ type: 'addSection' })}
                        size="icon"
                        variant="ghost"
                    >
                        <Plus />
                    </Button>
                }
            />
            <div className="space-y-1">
                {document.sections.map((section) => (
                    <div key={section.id}>
                        <button
                            className={cn(
                                'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent',
                                selected?.id === section.id &&
                                    'bg-accent text-accent-foreground',
                            )}
                            onClick={() =>
                                dispatch({
                                    type: 'select',
                                    selection: {
                                        kind: 'section',
                                        id: section.id,
                                    },
                                })
                            }
                            type="button"
                        >
                            <ChevronDown className="size-3.5 text-muted-foreground" />
                            <Layers3 className="size-4 text-muted-foreground" />
                            <span className="min-w-0 flex-1 truncate font-medium">
                                {section.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {section.containers.reduce(
                                    (total, container) =>
                                        total + container.blocks.length,
                                    0,
                                )}
                            </span>
                        </button>
                        <div className="ml-4 border-l border-border/70 pl-2">
                            {section.containers.map((container) => (
                                <div key={container.id}>
                                    <button
                                        className={cn(
                                            'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                                            selected?.id === container.id &&
                                                'bg-accent text-accent-foreground',
                                        )}
                                        onClick={() =>
                                            dispatch({
                                                type: 'select',
                                                selection: {
                                                    kind: 'container',
                                                    id: container.id,
                                                },
                                            })
                                        }
                                        type="button"
                                    >
                                        <ChevronRight className="size-3" />
                                        <SquareStack className="size-3.5" />
                                        <span className="truncate">
                                            {container.label}
                                        </span>
                                    </button>
                                    <div className="ml-5 space-y-0.5">
                                        {container.blocks.map((block) => {
                                            const Icon = blockIcon(block.kind);

                                            return (
                                                <button
                                                    className={cn(
                                                        'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                                                        selected?.id ===
                                                            block.id &&
                                                            'bg-primary/10 text-primary',
                                                    )}
                                                    key={block.id}
                                                    onClick={() =>
                                                        dispatch({
                                                            type: 'select',
                                                            selection: {
                                                                kind: 'block',
                                                                id: block.id,
                                                            },
                                                        })
                                                    }
                                                    type="button"
                                                >
                                                    <Icon className="size-3.5" />
                                                    <span className="truncate">
                                                        {block.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LeftPanel({
    state,
    dispatch,
}: {
    state: EditorState;
    dispatch: React.Dispatch<EditorAction>;
}) {
    return (
        <aside className="hidden w-72 shrink-0 flex-col border-r bg-background lg:flex">
            <div className="flex h-16 items-center border-b px-5">
                <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                        Prototype A
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                        Build your story
                    </p>
                </div>
            </div>
            <div className="flex-1 space-y-8 overflow-y-auto p-5">
                <DocumentOutline
                    dispatch={dispatch}
                    document={state.document}
                    selected={state.selected}
                />
                <Separator />
                <BlockPalette
                    onAddBlock={(kind) => dispatch({ type: 'addBlock', kind })}
                />
            </div>
            <div className="border-t p-5">
                <div className="flex gap-3 rounded-lg bg-muted/60 p-3">
                    <CircleHelp className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        This is a throwaway prototype. The controls are here to
                        test the editor hierarchy, not persistence.
                    </p>
                </div>
            </div>
        </aside>
    );
}

function CanvasBlock({
    block,
    selected,
    dispatch,
}: {
    block: Block;
    selected: boolean;
    dispatch: React.Dispatch<EditorAction>;
}) {
    const sharedClasses = cn(
        'group relative rounded-xl border border-transparent p-4 transition-all',
        selected &&
            'border-primary/60 bg-primary/[0.04] shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_12%,transparent)]',
        !selected && 'hover:border-border hover:bg-muted/40',
    );

    if (block.kind === 'image') {
        return (
            <button
                className={cn(sharedClasses, 'block w-full text-left')}
                onClick={() =>
                    dispatch({
                        type: 'select',
                        selection: { kind: 'block', id: block.id },
                    })
                }
                type="button"
            >
                <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 text-rose-950 dark:from-amber-950/70 dark:via-rose-950/70 dark:to-sky-950/70 dark:text-rose-100">
                    <div className="space-y-2 text-center">
                        <ImageIcon className="mx-auto size-7 opacity-70" />
                        <p className="text-xs font-medium opacity-80">
                            {block.content}
                        </p>
                    </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                    {block.alt}
                </p>
                {selected && <SelectionBadge kind="Image" />}
            </button>
        );
    }

    if (block.kind === 'button') {
        return (
            <button
                className={sharedClasses}
                onClick={() =>
                    dispatch({
                        type: 'select',
                        selection: { kind: 'block', id: block.id },
                    })
                }
                type="button"
            >
                <span className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm">
                    {block.content}
                </span>
                {selected && <SelectionBadge kind="Button" />}
            </button>
        );
    }

    return (
        <button
            className={cn(sharedClasses, 'block w-full text-left')}
            onClick={() =>
                dispatch({
                    type: 'select',
                    selection: { kind: 'block', id: block.id },
                })
            }
            type="button"
        >
            <p className="text-[clamp(1.5rem,3vw,2.25rem)] leading-tight font-semibold tracking-[-0.04em] text-balance text-foreground">
                {block.content}
            </p>
            {selected && <SelectionBadge kind="Text" />}
        </button>
    );
}

function SelectionBadge({ kind }: { kind: string }) {
    return (
        <span className="absolute -top-3 left-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
            {kind}
        </span>
    );
}

function InvitationCanvas({
    state,
    dispatch,
}: {
    state: EditorState;
    dispatch: React.Dispatch<EditorAction>;
}) {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-muted/40">
            <div className="flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-5 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MousePointer2 className="size-4" />
                    <span>Canvas</span>
                    <span className="text-border">/</span>
                    <span>{viewportLabels[state.viewport]} preview</span>
                </div>
                <ToggleGroup
                    aria-label="Canvas viewport"
                    onValueChange={(value) => {
                        if (value) {
                            dispatch({
                                type: 'setViewport',
                                viewport: value as Viewport,
                            });
                        }
                    }}
                    type="single"
                    value={state.viewport}
                    variant="outline"
                >
                    <ToggleGroupItem
                        aria-label="Desktop viewport"
                        className="px-2.5 text-xs"
                        value="desktop"
                    >
                        Desktop
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        aria-label="Tablet viewport"
                        className="px-2.5 text-xs"
                        value="tablet"
                    >
                        Tablet
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        aria-label="Mobile viewport"
                        className="px-2.5 text-xs"
                        value="mobile"
                    >
                        Mobile
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-6 pb-24 sm:p-10 sm:pb-24">
                <div
                    className={cn(
                        'mx-auto overflow-hidden rounded-2xl border bg-card shadow-xl shadow-black/5 transition-[width] duration-300 dark:shadow-black/20',
                        viewportWidths[state.viewport],
                    )}
                >
                    <div className="border-b bg-muted/30 px-6 py-4 text-center">
                        <p className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                            The wedding of
                        </p>
                        <p className="mt-2 font-serif text-xl tracking-tight">
                            Raka & Aulia
                        </p>
                    </div>
                    <div className="space-y-5 p-6 sm:p-10">
                        {state.document.sections.map((section) => {
                            const isSectionSelected =
                                state.selected?.id === section.id;

                            return (
                                <section
                                    className={cn(
                                        'relative space-y-4 rounded-2xl border border-dashed border-border/70 p-4 transition-colors sm:p-5',
                                        isSectionSelected &&
                                            'border-primary/70 bg-primary/[0.03]',
                                    )}
                                    key={section.id}
                                    onClick={(event) => {
                                        if (
                                            event.currentTarget === event.target
                                        ) {
                                            dispatch({
                                                type: 'select',
                                                selection: {
                                                    kind: 'section',
                                                    id: section.id,
                                                },
                                            });
                                        }
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            className="flex min-w-0 items-center gap-2 text-left"
                                            onClick={() =>
                                                dispatch({
                                                    type: 'select',
                                                    selection: {
                                                        kind: 'section',
                                                        id: section.id,
                                                    },
                                                })
                                            }
                                            type="button"
                                        >
                                            <span className="flex size-6 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                                                <Layers3 className="size-3.5" />
                                            </span>
                                            <span className="truncate text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                                {section.label}
                                            </span>
                                        </button>
                                        {isSectionSelected && (
                                            <Badge variant="secondary">
                                                Section selected
                                            </Badge>
                                        )}
                                    </div>
                                    {section.containers.map((container) => {
                                        const isContainerSelected =
                                            state.selected?.id === container.id;

                                        return (
                                            <div
                                                className={cn(
                                                    'space-y-2 rounded-xl border border-border/60 bg-background/80 p-2',
                                                    isContainerSelected &&
                                                        'border-primary/50 ring-2 ring-primary/10',
                                                )}
                                                key={container.id}
                                                onClick={(event) => {
                                                    if (
                                                        event.currentTarget ===
                                                        event.target
                                                    ) {
                                                        dispatch({
                                                            type: 'select',
                                                            selection: {
                                                                kind: 'container',
                                                                id: container.id,
                                                            },
                                                        });
                                                    }
                                                }}
                                            >
                                                {container.blocks.length ===
                                                0 ? (
                                                    <button
                                                        className="flex min-h-24 w-full items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                                        onClick={() =>
                                                            dispatch({
                                                                type: 'select',
                                                                selection: {
                                                                    kind: 'container',
                                                                    id: container.id,
                                                                },
                                                            })
                                                        }
                                                        type="button"
                                                    >
                                                        Select this container to
                                                        add a block
                                                    </button>
                                                ) : (
                                                    container.blocks.map(
                                                        (block) => (
                                                            <CanvasBlock
                                                                block={block}
                                                                dispatch={
                                                                    dispatch
                                                                }
                                                                key={block.id}
                                                                selected={
                                                                    state
                                                                        .selected
                                                                        ?.id ===
                                                                    block.id
                                                                }
                                                            />
                                                        ),
                                                    )
                                                )}
                                            </div>
                                        );
                                    })}
                                </section>
                            );
                        })}
                        <button
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/[0.03] hover:text-foreground"
                            onClick={() => dispatch({ type: 'addSection' })}
                            type="button"
                        >
                            <Plus className="size-4" />
                            Add a new section
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BlockProperties({
    block,
    state,
    dispatch,
}: {
    block: Block | null;
    state: EditorState;
    dispatch: React.Dispatch<EditorAction>;
}) {
    if (!block) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                    <Settings2 className="size-5 text-muted-foreground" />
                </span>
                <div className="space-y-1">
                    <p className="text-sm font-medium">Nothing selected</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        Select a block on the Canvas or from the outline to edit
                        its properties.
                    </p>
                </div>
            </div>
        );
    }

    const Icon = blockIcon(block.kind);

    return (
        <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="space-y-4 p-5">
                <PanelHeading
                    eyebrow="Properties"
                    title={blockKindLabel(block.kind)}
                    action={<Icon className="size-4 text-muted-foreground" />}
                />
                <div className="space-y-2">
                    <Label htmlFor="block-label">Layer name</Label>
                    <Input
                        id="block-label"
                        onChange={(event) =>
                            dispatch({
                                type: 'updateBlock',
                                id: block.id,
                                changes: { label: event.target.value },
                            })
                        }
                        value={block.label}
                    />
                    <p className="text-xs text-muted-foreground">
                        Used to find this block in the page outline.
                    </p>
                </div>
                {block.kind === 'text' && (
                    <div className="space-y-2">
                        <Label htmlFor="block-content">Content</Label>
                        <textarea
                            className="min-h-32 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            id="block-content"
                            onChange={(event) =>
                                dispatch({
                                    type: 'updateBlock',
                                    id: block.id,
                                    changes: { content: event.target.value },
                                })
                            }
                            value={block.content}
                        />
                    </div>
                )}
                {block.kind === 'image' && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="image-alt">Alternative text</Label>
                            <Input
                                id="image-alt"
                                onChange={(event) =>
                                    dispatch({
                                        type: 'updateBlock',
                                        id: block.id,
                                        changes: { alt: event.target.value },
                                    })
                                }
                                value={block.alt ?? ''}
                            />
                        </div>
                        <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-md bg-background">
                                    <ImageIcon className="size-4 text-muted-foreground" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium">
                                        Upload placeholder
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        Media upload comes in the next ticket.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {block.kind === 'button' && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="button-label">Button label</Label>
                            <Input
                                id="button-label"
                                onChange={(event) =>
                                    dispatch({
                                        type: 'updateBlock',
                                        id: block.id,
                                        changes: {
                                            content: event.target.value,
                                        },
                                    })
                                }
                                value={block.content}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="button-url">Destination</Label>
                            <Input
                                id="button-url"
                                onChange={(event) =>
                                    dispatch({
                                        type: 'updateBlock',
                                        id: block.id,
                                        changes: { href: event.target.value },
                                    })
                                }
                                value={block.href ?? ''}
                            />
                            <p className="text-xs text-muted-foreground">
                                Link validation comes in the Button block
                                ticket.
                            </p>
                        </div>
                    </>
                )}
            </div>
            <Separator />
            <div className="space-y-3 p-5">
                <PanelHeading eyebrow="Arrange" title="Block actions" />
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        onClick={() =>
                            dispatch({
                                type: 'moveBlock',
                                id: block.id,
                                direction: 'up',
                            })
                        }
                        size="sm"
                        variant="outline"
                    >
                        <ArrowUp />
                        Move up
                    </Button>
                    <Button
                        onClick={() =>
                            dispatch({
                                type: 'moveBlock',
                                id: block.id,
                                direction: 'down',
                            })
                        }
                        size="sm"
                        variant="outline"
                    >
                        <ArrowDown />
                        Move down
                    </Button>
                    <Button
                        onClick={() =>
                            dispatch({ type: 'duplicateBlock', id: block.id })
                        }
                        size="sm"
                        variant="outline"
                    >
                        <SquareStack />
                        Duplicate
                    </Button>
                    <Button
                        onClick={() =>
                            dispatch({ type: 'removeBlock', id: block.id })
                        }
                        size="sm"
                        variant="outline"
                    >
                        <Trash2 />
                        Remove
                    </Button>
                </div>
            </div>
            <StateSnapshot state={state} />
        </div>
    );
}

function StateSnapshot({ state }: { state: EditorState }) {
    const selectedLabel = state.selected
        ? `${state.selected.kind} · ${state.selected.id}`
        : 'Nothing selected';

    return (
        <div className="mt-auto border-t bg-muted/30 p-5">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <MoveVertical className="size-4 text-muted-foreground" />
                    <p className="text-xs font-semibold">State snapshot</p>
                </div>
                <Badge variant="outline">Prototype</Badge>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <dt className="text-muted-foreground">Sections</dt>
                <dd className="text-right font-medium">
                    {state.document.sections.length}
                </dd>
                <dt className="text-muted-foreground">Blocks</dt>
                <dd className="text-right font-medium">
                    {countBlocks(state.document)}
                </dd>
                <dt className="text-muted-foreground">Viewport</dt>
                <dd className="text-right font-medium">
                    {viewportLabels[state.viewport]}
                </dd>
                <dt className="text-muted-foreground">Selected</dt>
                <dd
                    className="truncate text-right font-medium"
                    title={selectedLabel}
                >
                    {selectedLabel}
                </dd>
            </dl>
        </div>
    );
}

function RightPanel({
    state,
    dispatch,
}: {
    state: EditorState;
    dispatch: React.Dispatch<EditorAction>;
}) {
    const selectedBlock =
        state.selected?.kind === 'block'
            ? findBlock(state.document, state.selected.id)
            : null;

    return (
        <aside className="hidden w-80 shrink-0 flex-col border-l bg-background xl:flex">
            <div className="flex h-16 items-center justify-between border-b px-5">
                <div className="flex items-center gap-2">
                    <Settings2 className="size-4 text-muted-foreground" />
                    <p className="text-sm font-semibold">Inspector</p>
                </div>
                <Badge variant="secondary">A</Badge>
            </div>
            <BlockProperties
                block={selectedBlock}
                dispatch={dispatch}
                state={state}
            />
        </aside>
    );
}

function PrototypeSwitcher() {
    const [variant, setVariant] = useState('A');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const requestedVariant = params.get('variant');

        if (requestedVariant === 'A') {
            setVariant(requestedVariant);
        }
    }, []);

    function updateVariant(nextVariant: string) {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', nextVariant);
        window.history.replaceState({}, '', url);
        setVariant(nextVariant);
    }

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const target = event.target as HTMLElement | null;

            if (target?.matches('input, textarea, select, [contenteditable]')) {
                return;
            }

            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                updateVariant('A');
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/95 p-1.5 shadow-lg shadow-black/10 backdrop-blur dark:shadow-black/30">
            <Button
                aria-label="Previous prototype variant"
                disabled
                onClick={() => updateVariant('A')}
                size="icon"
                variant="ghost"
            >
                <ArrowLeft />
            </Button>
            <div className="min-w-44 px-3 text-center">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Prototype variant
                </p>
                <p className="text-xs font-semibold">
                    {variant} · Three-pane editor
                </p>
            </div>
            <Button
                aria-label="Next prototype variant"
                disabled
                onClick={() => updateVariant('A')}
                size="icon"
                variant="ghost"
            >
                <ArrowRight />
            </Button>
        </div>
    );
}

export default function InvitationEditorPrototype() {
    const [state, dispatch] = useReducer(editorReducer, initialState);
    const selectedBlock =
        state.selected?.kind === 'block'
            ? findBlock(state.document, state.selected.id)
            : null;

    const blockCount = useMemo(
        () => countBlocks(state.document),
        [state.document],
    );

    return (
        <>
            <Head title="Invitation editor prototype" />
            <div className="flex h-screen min-h-[720px] flex-col overflow-hidden bg-background text-foreground">
                <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="hidden size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground sm:flex">
                            <Layers3 className="size-4" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold tracking-tight">
                                    The wedding of Raka & Aulia
                                </p>
                                <Badge variant="outline">Prototype</Badge>
                            </div>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                <LockKeyhole className="size-3" />
                                <span>Private draft</span>
                                <span className="text-border">·</span>
                                <span>{blockCount} blocks</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            className="hidden sm:inline-flex"
                            variant={
                                state.saveState === 'saved'
                                    ? 'secondary'
                                    : 'outline'
                            }
                        >
                            {state.saveState === 'saved'
                                ? 'Saved just now'
                                : 'Unsaved changes'}
                        </Badge>
                        <Button
                            onClick={() => dispatch({ type: 'save' })}
                            size="sm"
                            variant={
                                state.saveState === 'unsaved'
                                    ? 'default'
                                    : 'outline'
                            }
                        >
                            <Save />
                            Save
                        </Button>
                        <Button size="sm" variant="outline">
                            <Eye />
                            <span className="hidden sm:inline">Preview</span>
                        </Button>
                    </div>
                </header>
                <div className="flex min-h-0 flex-1">
                    <LeftPanel dispatch={dispatch} state={state} />
                    <InvitationCanvas dispatch={dispatch} state={state} />
                    <RightPanel dispatch={dispatch} state={state} />
                </div>
                <div className="fixed right-4 bottom-5 z-40 flex items-center gap-1 rounded-lg border border-border bg-background/95 p-1 shadow-md backdrop-blur xl:hidden">
                    <Button
                        aria-label="Undo last action"
                        disabled
                        size="icon"
                        variant="ghost"
                    >
                        <Undo2 />
                    </Button>
                    <Button
                        aria-label="Redo last action"
                        disabled
                        size="icon"
                        variant="ghost"
                    >
                        <Redo2 />
                    </Button>
                    <Separator className="mx-1 h-5" orientation="vertical" />
                    <span className="px-2 text-xs text-muted-foreground">
                        {selectedBlock
                            ? blockKindLabel(selectedBlock.kind)
                            : 'Select'}
                    </span>
                </div>
                <PrototypeSwitcher />
            </div>
        </>
    );
}

InvitationEditorPrototype.layout = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
