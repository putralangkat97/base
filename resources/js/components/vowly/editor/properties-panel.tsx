import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react';
import type {
    DesignBlock,
    DesignDocument,
    DesignGrid,
    DesignMedia,
    DocumentAction,
    Selection,
} from '@/types/design-document';
import { selectedNode } from '@/lib/design-document';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    document: DesignDocument;
    media: DesignMedia[];
    selection: Selection;
    dispatch: React.Dispatch<DocumentAction>;
    onUpload: (file: File) => void;
    uploadMessage?: string;
    errors: Record<string, string>;
};

function Actions({
    onDuplicate,
    onRemove,
    onMoveUp,
    onMoveDown,
}: {
    onDuplicate?: () => void;
    onRemove?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {onMoveUp && (
                <Button
                    aria-label="Move up"
                    onClick={onMoveUp}
                    size="icon"
                    title="Move up"
                    type="button"
                    variant="outline"
                >
                    <ArrowUp />
                </Button>
            )}
            {onMoveDown && (
                <Button
                    aria-label="Move down"
                    onClick={onMoveDown}
                    size="icon"
                    title="Move down"
                    type="button"
                    variant="outline"
                >
                    <ArrowDown />
                </Button>
            )}
            {onDuplicate && (
                <Button
                    onClick={onDuplicate}
                    size="sm"
                    type="button"
                    variant="outline"
                >
                    <Copy />
                    Duplicate
                </Button>
            )}
            {onRemove && (
                <Button
                    onClick={onRemove}
                    size="sm"
                    type="button"
                    variant="ghost"
                >
                    <Trash2 />
                    Remove
                </Button>
            )}
        </div>
    );
}

function Field({
    id,
    label,
    value,
    onChange,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                onChange={(event) => onChange(event.target.value)}
                value={value}
            />
        </div>
    );
}

function destinationError(href: string): string | undefined {
    if (href.trim() === '') {
        return 'A destination URL is required.';
    }

    try {
        const url = new URL(href);

        if (
            !['http:', 'https:'].includes(url.protocol) ||
            url.hostname === ''
        ) {
            return 'Use a valid HTTP or HTTPS URL.';
        }
    } catch {
        return 'Use a valid HTTP or HTTPS URL.';
    }

    return undefined;
}

export default function PropertiesPanel({
    document,
    media,
    selection,
    dispatch,
    onUpload,
    uploadMessage,
    errors,
}: Props) {
    const node = selectedNode(document, selection);

    if (!node || !selection) {
        return (
            <aside className="rounded-xl border bg-background/80 p-4 shadow-sm">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Properties
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                    Select a node on the canvas to edit its properties.
                </p>
            </aside>
        );
    }

    if (selection.kind === 'section' && node.type === 'section') {
        return (
            <aside className="space-y-5 rounded-xl border bg-background/80 p-4 shadow-sm">
                <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Section
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{node.label}</h2>
                </div>
                <Field
                    id="section-label"
                    label="Section title"
                    onChange={(label) =>
                        dispatch({ type: 'update-section', id: node.id, label })
                    }
                    value={node.label}
                />
                <Button
                    className="w-full"
                    onClick={() =>
                        dispatch({ type: 'add-container', sectionId: node.id })
                    }
                    type="button"
                    variant="outline"
                >
                    <Plus />
                    Add container
                </Button>
                <Actions
                    onDuplicate={() =>
                        dispatch({ type: 'duplicate-section', id: node.id })
                    }
                    onMoveDown={() =>
                        dispatch({
                            type: 'move-section',
                            id: node.id,
                            direction: 'down',
                        })
                    }
                    onMoveUp={() =>
                        dispatch({
                            type: 'move-section',
                            id: node.id,
                            direction: 'up',
                        })
                    }
                    onRemove={() =>
                        dispatch({ type: 'remove-section', id: node.id })
                    }
                />
            </aside>
        );
    }

    if (selection.kind === 'container' && node.type === 'container') {
        const grid: DesignGrid = node.grid;

        return (
            <aside className="space-y-5 rounded-xl border bg-background/80 p-4 shadow-sm">
                <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Container
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{node.label}</h2>
                </div>
                <Field
                    id="container-label"
                    label="Container label"
                    onChange={(label) =>
                        dispatch({
                            type: 'update-container',
                            id: node.id,
                            label,
                        })
                    }
                    value={node.label}
                />
                <div className="grid gap-2">
                    <Label htmlFor="grid-layout">Layout</Label>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        id="grid-layout"
                        onChange={(event) =>
                            dispatch({
                                type: 'update-grid',
                                id: node.id,
                                changes: {
                                    layout: event.target
                                        .value as DesignGrid['layout'],
                                },
                            })
                        }
                        value={grid.layout ?? 'grid'}
                    >
                        <option value="stack">Stack</option>
                        <option value="grid">Grid</option>
                    </select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="grid-columns">Columns</Label>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        disabled={grid.layout === 'stack'}
                        id="grid-columns"
                        onChange={(event) =>
                            dispatch({
                                type: 'update-grid',
                                id: node.id,
                                changes: {
                                    columns: Number(event.target.value) as
                                        | 1
                                        | 2
                                        | 3,
                                },
                            })
                        }
                        value={grid.columns}
                    >
                        <option value="1">One column</option>
                        <option value="2">Two columns</option>
                        <option value="3">Three columns</option>
                    </select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="grid-gap">Gap</Label>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        id="grid-gap"
                        onChange={(event) =>
                            dispatch({
                                type: 'update-grid',
                                id: node.id,
                                changes: {
                                    gap: event.target
                                        .value as DesignGrid['gap'],
                                },
                            })
                        }
                        value={grid.gap}
                    >
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                    </select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="grid-stack-at">Stack at</Label>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        id="grid-stack-at"
                        onChange={(event) =>
                            dispatch({
                                type: 'update-grid',
                                id: node.id,
                                changes: {
                                    stackAt: event.target
                                        .value as DesignGrid['stackAt'],
                                },
                            })
                        }
                        value={grid.stackAt}
                    >
                        <option value="mobile">Mobile</option>
                        <option value="tablet">Tablet</option>
                    </select>
                </div>
                <Actions />
            </aside>
        );
    }

    if (selection.kind === 'block' && node.type === 'text') {
        return (
            <aside className="space-y-5 rounded-xl border bg-background/80 p-4 shadow-sm">
                <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Text block
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{node.label}</h2>
                </div>
                <Field
                    id="text-label"
                    label="Block label"
                    onChange={(label) =>
                        dispatch({
                            type: 'update-block',
                            id: node.id,
                            changes: { label },
                        })
                    }
                    value={node.label}
                />
                <div className="grid gap-2">
                    <Label htmlFor="text-content">Content</Label>
                    <textarea
                        className="min-h-32 resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        id="text-content"
                        onChange={(event) =>
                            dispatch({
                                type: 'update-block',
                                id: node.id,
                                changes: { content: event.target.value },
                            })
                        }
                        value={node.content}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="text-align">Alignment</Label>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        id="text-align"
                        onChange={(event) =>
                            dispatch({
                                type: 'update-block',
                                id: node.id,
                                changes: {
                                    align: event.target.value as
                                        | 'left'
                                        | 'center'
                                        | 'right',
                                },
                            })
                        }
                        value={node.align}
                    >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>
                <Actions
                    onDuplicate={() =>
                        dispatch({ type: 'duplicate-block', id: node.id })
                    }
                    onMoveDown={() =>
                        dispatch({
                            type: 'move-block',
                            id: node.id,
                            direction: 'down',
                        })
                    }
                    onMoveUp={() =>
                        dispatch({
                            type: 'move-block',
                            id: node.id,
                            direction: 'up',
                        })
                    }
                    onRemove={() =>
                        dispatch({ type: 'remove-block', id: node.id })
                    }
                />
            </aside>
        );
    }

    if (selection.kind === 'block' && node.type === 'image') {
        return (
            <aside className="space-y-5 rounded-xl border bg-background/80 p-4 shadow-sm">
                <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Image block
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{node.label}</h2>
                </div>
                <Field
                    id="image-label"
                    label="Block label"
                    onChange={(label) =>
                        dispatch({
                            type: 'update-block',
                            id: node.id,
                            changes: { label },
                        })
                    }
                    value={node.label}
                />
                <Field
                    id="image-alt"
                    label="Alt text"
                    onChange={(alt) =>
                        dispatch({
                            type: 'update-block',
                            id: node.id,
                            changes: { alt },
                        })
                    }
                    value={node.alt}
                />
                <div className="grid gap-2">
                    <Label htmlFor="image-media">Saved image</Label>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        id="image-media"
                        onChange={(event) =>
                            dispatch({
                                type: 'update-block',
                                id: node.id,
                                changes: {
                                    mediaId: event.target.value || null,
                                },
                            })
                        }
                        value={node.mediaId ?? ''}
                    >
                        <option value="">No image selected</option>
                        {media.map((item) => (
                            <option
                                key={item.id}
                                value={item.id}
                            >{`Image ${item.id}`}</option>
                        ))}
                    </select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="image-upload">Upload image</Label>
                    <Input
                        accept="image/jpeg,image/png,image/webp"
                        id="image-upload"
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) onUpload(file);
                            event.currentTarget.value = '';
                        }}
                        type="file"
                    />
                    {uploadMessage && (
                        <p className="text-xs text-muted-foreground">
                            {uploadMessage}
                        </p>
                    )}
                    <InputError message={errors.photo ?? errors['photo.0']} />
                </div>
                <Actions
                    onDuplicate={() =>
                        dispatch({ type: 'duplicate-block', id: node.id })
                    }
                    onMoveDown={() =>
                        dispatch({
                            type: 'move-block',
                            id: node.id,
                            direction: 'down',
                        })
                    }
                    onMoveUp={() =>
                        dispatch({
                            type: 'move-block',
                            id: node.id,
                            direction: 'up',
                        })
                    }
                    onRemove={() =>
                        dispatch({ type: 'remove-block', id: node.id })
                    }
                />
            </aside>
        );
    }

    const button = node as Extract<DesignBlock, { type: 'button' }>;

    return (
        <aside className="space-y-5 rounded-xl border bg-background/80 p-4 shadow-sm">
            <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Button block
                </p>
                <h2 className="mt-1 text-lg font-semibold">{button.label}</h2>
            </div>
            <Field
                id="button-label"
                label="Block label"
                onChange={(label) =>
                    dispatch({
                        type: 'update-block',
                        id: button.id,
                        changes: { label },
                    })
                }
                value={button.label}
            />
            <Field
                id="button-text"
                label="Button text"
                onChange={(text) =>
                    dispatch({
                        type: 'update-block',
                        id: button.id,
                        changes: { text },
                    })
                }
                value={button.text}
            />
            <div className="grid gap-2">
                <Label htmlFor="button-href">Destination URL</Label>
                <Input
                    id="button-href"
                    onChange={(event) =>
                        dispatch({
                            type: 'update-block',
                            id: button.id,
                            changes: { href: event.target.value },
                        })
                    }
                    type="url"
                    value={button.href}
                />
                <InputError
                    message={errors.document ?? destinationError(button.href)}
                />
                <p className="text-xs text-muted-foreground">
                    Use an approved https:// or http:// destination.
                </p>
            </div>
            <Actions
                onDuplicate={() =>
                    dispatch({ type: 'duplicate-block', id: button.id })
                }
                onMoveDown={() =>
                    dispatch({
                        type: 'move-block',
                        id: button.id,
                        direction: 'down',
                    })
                }
                onMoveUp={() =>
                    dispatch({
                        type: 'move-block',
                        id: button.id,
                        direction: 'up',
                    })
                }
                onRemove={() =>
                    dispatch({ type: 'remove-block', id: button.id })
                }
            />
        </aside>
    );
}
