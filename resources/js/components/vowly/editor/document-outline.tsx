import { GripVertical, Layers3, Plus, SquareStack, Type } from 'lucide-react';
import type {
    DesignBlock,
    DesignDocument,
    DocumentAction,
    Selection,
} from '@/types/design-document';
import { cn } from '@/lib/utils';

type Props = {
    document: DesignDocument;
    selection: Selection;
    dispatch: React.Dispatch<DocumentAction>;
};

function OutlineButton({
    active,
    children,
    onClick,
    level = 0,
}: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
    level?: number;
}) {
    return (
        <button
            className={cn(
                'flex w-full min-w-0 items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
                active && 'bg-accent text-accent-foreground',
                level === 1 && 'pl-6',
                level === 2 && 'pl-9',
            )}
            onClick={onClick}
            type="button"
        >
            {children}
        </button>
    );
}

function BlockIcon({ block }: { block: DesignBlock }) {
    if (block.type === 'text') {
        return <Type className="size-3.5 shrink-0" />;
    }

    if (block.type === 'image') {
        return <SquareStack className="size-3.5 shrink-0" />;
    }

    return <Plus className="size-3.5 shrink-0" />;
}

export default function DocumentOutline({
    document,
    selection,
    dispatch,
}: Props) {
    return (
        <aside className="flex min-h-0 flex-col gap-4 rounded-xl border bg-background/80 p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2 px-1">
                <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Outline
                    </p>
                    <p className="text-sm font-medium">Invitation structure</p>
                </div>
                <button
                    aria-label="Add section"
                    className="inline-flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => dispatch({ type: 'add-section' })}
                    title="Add section"
                    type="button"
                >
                    <Plus className="size-4" />
                </button>
            </div>

            <div className="min-h-0 space-y-1 overflow-y-auto pr-1">
                {document.sections.length === 0 ? (
                    <button
                        className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => dispatch({ type: 'add-section' })}
                        type="button"
                    >
                        <Layers3 className="size-5" />
                        Add your first section
                    </button>
                ) : (
                    document.sections.map((section) => (
                        <div key={section.id} className="space-y-1">
                            <OutlineButton
                                active={selection?.id === section.id}
                                onClick={() =>
                                    dispatch({
                                        type: 'select',
                                        selection: {
                                            kind: 'section',
                                            id: section.id,
                                        },
                                    })
                                }
                            >
                                <Layers3 className="size-4 shrink-0" />
                                <span className="truncate">
                                    {section.label}
                                </span>
                            </OutlineButton>
                            {section.containers.map((container) => (
                                <div key={container.id} className="space-y-1">
                                    <OutlineButton
                                        active={selection?.id === container.id}
                                        level={1}
                                        onClick={() =>
                                            dispatch({
                                                type: 'select',
                                                selection: {
                                                    kind: 'container',
                                                    id: container.id,
                                                },
                                            })
                                        }
                                    >
                                        <GripVertical className="size-3.5 shrink-0 text-muted-foreground" />
                                        <span className="truncate">
                                            {container.label}
                                        </span>
                                    </OutlineButton>
                                    {container.blocks.map((block) => (
                                        <OutlineButton
                                            active={selection?.id === block.id}
                                            key={block.id}
                                            level={2}
                                            onClick={() =>
                                                dispatch({
                                                    type: 'select',
                                                    selection: {
                                                        kind: 'block',
                                                        id: block.id,
                                                    },
                                                })
                                            }
                                        >
                                            <BlockIcon block={block} />
                                            <span className="truncate">
                                                {block.label}
                                            </span>
                                        </OutlineButton>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            <div className="border-t pt-3">
                <p className="mb-2 px-1 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Add block
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {(['text', 'image', 'button'] as const).map((kind) => (
                        <button
                            className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-md border border-dashed px-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            key={kind}
                            onClick={() =>
                                dispatch({ type: 'add-block', kind })
                            }
                            type="button"
                        >
                            {kind === 'text' ? (
                                <Type className="size-4" />
                            ) : kind === 'image' ? (
                                <SquareStack className="size-4" />
                            ) : (
                                <Plus className="size-4" />
                            )}
                            {kind[0].toUpperCase() + kind.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}
