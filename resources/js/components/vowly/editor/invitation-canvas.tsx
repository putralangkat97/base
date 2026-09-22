import { ImageOff, MousePointer2 } from 'lucide-react';
import type {
    DesignBlock,
    DesignDocument,
    DesignMedia,
    Selection,
    Viewport,
} from '@/types/design-document';
import { cn } from '@/lib/utils';

type Props = {
    document: DesignDocument;
    media: DesignMedia[];
    selection: Selection;
    viewport: Viewport;
    readOnly?: boolean;
    onSelect?: (selection: Selection) => void;
};

const frameClasses: Record<Viewport, string> = {
    mobile: 'max-w-sm',
    tablet: 'max-w-xl',
    desktop: 'max-w-4xl',
};

const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
} as const;

function blockSelection(block: DesignBlock): Selection {
    return { kind: 'block', id: block.id };
}

function BlockPreview({
    block,
    media,
}: {
    block: DesignBlock;
    media: DesignMedia[];
}) {
    if (block.type === 'text') {
        return (
            <p
                className={cn(
                    'text-base leading-7 whitespace-pre-wrap',
                    block.align === 'center' && 'text-center',
                    block.align === 'right' && 'text-right',
                )}
            >
                {block.content}
            </p>
        );
    }

    if (block.type === 'image') {
        const image = media.find(
            (candidate) => String(candidate.id) === block.mediaId,
        );

        return image ? (
            <img
                alt={block.alt}
                className="aspect-[4/3] w-full rounded-lg object-cover"
                src={image.url}
            />
        ) : (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 text-center text-sm text-muted-foreground">
                <ImageOff className="size-5" />
                <span>
                    {block.alt || 'Choose an image in the properties panel.'}
                </span>
            </div>
        );
    }

    return (
        <button
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            onClick={(event) => event.preventDefault()}
            type="button"
        >
            {block.text}
        </button>
    );
}

function effectiveColumns(
    columns: 1 | 2 | 3,
    stackAt: 'mobile' | 'tablet',
    viewport: Viewport,
    layout: 'stack' | 'grid' | undefined,
): 1 | 2 | 3 {
    if (
        layout === 'stack' ||
        viewport === 'mobile' ||
        (stackAt === 'tablet' && viewport === 'tablet')
    ) {
        return 1;
    }

    return columns;
}

const columnsClasses: Record<1 | 2 | 3, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
};

export default function InvitationCanvas({
    document,
    media,
    selection,
    viewport,
    readOnly = false,
    onSelect,
}: Props) {
    return (
        <div className="flex min-h-[34rem] min-w-0 flex-col items-center rounded-xl border bg-muted/20 p-3 sm:p-6">
            <div className="mb-4 flex w-full max-w-4xl items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                    <MousePointer2 className="size-3.5" />
                    {readOnly
                        ? 'Saved preview'
                        : 'Select a section, container, or block'}
                </span>
                <span className="capitalize">{viewport} view</span>
            </div>
            <div
                className={cn(
                    'w-full min-w-0 overflow-hidden rounded-xl border bg-background p-4 shadow-sm transition-[max-width] sm:p-8',
                    frameClasses[viewport],
                )}
            >
                {document.sections.length === 0 ? (
                    <button
                        className="flex min-h-72 w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => onSelect?.(null)}
                        type="button"
                    >
                        <span className="text-base font-medium text-foreground">
                            Your invitation canvas is empty
                        </span>
                        Add a section from the outline to begin.
                    </button>
                ) : (
                    <div className="space-y-8">
                        {document.sections.map((section) => (
                            <section
                                aria-label={section.label}
                                className={cn(
                                    'group/section relative min-w-0 rounded-xl border p-4 transition-colors sm:p-6',
                                    !readOnly &&
                                        'cursor-pointer hover:border-primary/60',
                                    selection?.id === section.id &&
                                        'border-primary ring-2 ring-primary/20',
                                )}
                                key={section.id}
                                onClick={() =>
                                    !readOnly &&
                                    onSelect?.({
                                        kind: 'section',
                                        id: section.id,
                                    })
                                }
                                onKeyDown={(event) => {
                                    if (
                                        !readOnly &&
                                        (event.key === 'Enter' ||
                                            event.key === ' ')
                                    ) {
                                        event.preventDefault();
                                        onSelect?.({
                                            kind: 'section',
                                            id: section.id,
                                        });
                                    }
                                }}
                                role={readOnly ? undefined : 'button'}
                                tabIndex={readOnly ? undefined : 0}
                            >
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <h2 className="truncate text-lg font-semibold tracking-tight">
                                        {section.label}
                                    </h2>
                                    {!readOnly && (
                                        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover/section:opacity-100">
                                            Section
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    {section.containers.map((container) => {
                                        const columns = effectiveColumns(
                                            container.grid.columns,
                                            container.grid.stackAt,
                                            viewport,
                                            container.grid.layout,
                                        );

                                        return (
                                            <div
                                                className={cn(
                                                    'min-w-0 rounded-lg border border-dashed p-3 sm:p-4',
                                                    !readOnly &&
                                                        'cursor-pointer hover:border-primary/60',
                                                    selection?.id ===
                                                        container.id &&
                                                        'border-primary bg-primary/5 ring-2 ring-primary/20',
                                                )}
                                                key={container.id}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    if (!readOnly) {
                                                        onSelect?.({
                                                            kind: 'container',
                                                            id: container.id,
                                                        });
                                                    }
                                                }}
                                            >
                                                <div
                                                    className={cn(
                                                        'grid min-w-0',
                                                        columnsClasses[columns],
                                                        gapClasses[
                                                            container.grid.gap
                                                        ],
                                                    )}
                                                >
                                                    {container.blocks.map(
                                                        (block) => (
                                                            <div
                                                                className={cn(
                                                                    'min-w-0 rounded-lg p-2 transition-colors',
                                                                    !readOnly &&
                                                                        'cursor-pointer hover:bg-accent/50',
                                                                    selection?.id ===
                                                                        block.id &&
                                                                        'bg-accent ring-2 ring-primary/30',
                                                                )}
                                                                key={block.id}
                                                                onClick={(
                                                                    event,
                                                                ) => {
                                                                    event.stopPropagation();
                                                                    if (
                                                                        !readOnly
                                                                    ) {
                                                                        onSelect?.(
                                                                            blockSelection(
                                                                                block,
                                                                            ),
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <BlockPreview
                                                                    block={
                                                                        block
                                                                    }
                                                                    media={
                                                                        media
                                                                    }
                                                                />
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                                {container.blocks.length ===
                                                    0 && (
                                                    <p className="py-6 text-center text-sm text-muted-foreground">
                                                        Empty container
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
