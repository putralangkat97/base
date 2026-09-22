import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, Eye, Save, Sparkles } from 'lucide-react';
import { useReducer, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import InvitationCanvas from '@/components/vowly/editor/invitation-canvas';
import DocumentOutline from '@/components/vowly/editor/document-outline';
import PropertiesPanel from '@/components/vowly/editor/properties-panel';
import InvitationLayout from '@/layouts/vowly/invitation-layout';
import { designDocumentReducer, makeEmptyState } from '@/lib/design-document';
import { show as invitationShow } from '@/routes/vowly/invitations';
import designs from '@/routes/vowly/invitations/designs';
import type { DocumentAction, EditorSaveState } from '@/types/design-document';
import type { EditorWorkspace } from '@/types/invitations';

type Props = {
    invitation: EditorWorkspace;
};

const saveLabels: Record<EditorSaveState, string> = {
    clean: 'Clean',
    unsaved: 'Unsaved changes',
    saving: 'Saving…',
    saved: 'Saved',
    failed: 'Save failed',
};

function isMutation(action: DocumentAction): boolean {
    return action.type !== 'select' && action.type !== 'set-viewport';
}

export default function InvitationsEditor({ invitation }: Props) {
    const [state, dispatch] = useReducer(
        designDocumentReducer,
        invitation.activeDesign.document,
        makeEmptyState,
    );
    const [saveState, setSaveState] = useState<EditorSaveState>('clean');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadMessage, setUploadMessage] = useState<string>();
    const [uploading, setUploading] = useState(false);
    const hasSavedRef = useRef(false);

    function dispatchDocument(action: DocumentAction) {
        dispatch(action);

        if (isMutation(action)) {
            setSaveState('unsaved');
            setErrors({});
        }
    }

    function saveDocument() {
        setSaveState('saving');
        setErrors({});

        router.patch(
            designs.document.update.url({
                invitation: invitation.id,
                design: invitation.activeDesign.id,
            }),
            { document: state.document },
            {
                preserveScroll: true,
                preserveState: true,
                onError: (validationErrors) => {
                    setErrors(validationErrors as Record<string, string>);
                    setSaveState('failed');
                },
                onFinish: () => {
                    if (!hasSavedRef.current) {
                        setSaveState((current) =>
                            current === 'saving' ? 'failed' : current,
                        );
                    }
                    hasSavedRef.current = false;
                },
                onSuccess: () => {
                    hasSavedRef.current = true;
                    setSaveState('saved');
                },
            },
        );
    }

    function uploadImage(file: File) {
        setUploading(true);
        setUploadMessage('Uploading image…');

        router.post(
            designs.media.store.url({
                invitation: invitation.id,
                design: invitation.activeDesign.id,
            }),
            { photo: file },
            {
                forceFormData: true,
                preserveScroll: true,
                onError: (validationErrors) => {
                    setErrors(validationErrors as Record<string, string>);
                    setUploadMessage(
                        'Upload failed. Choose a supported image and try again.',
                    );
                },
                onFinish: () => setUploading(false),
                onSuccess: () =>
                    setUploadMessage(
                        'Image uploaded. Select it from Saved image.',
                    ),
            },
        );
    }

    function switchDesign(designId: string) {
        if (Number(designId) === invitation.activeDesign.id) {
            return;
        }

        router.post(
            designs.switch.url({
                invitation: invitation.id,
                design: Number(designId),
            }),
            {},
            {
                onSuccess: () => {
                    router.visit(
                        designs.editor.url({
                            invitation: invitation.id,
                            design: Number(designId),
                        }),
                    );
                },
            },
        );
    }

    return (
        <>
            <Head title={`${invitation.name} editor`} />

            <div className="flex min-w-0 flex-col gap-4">
                <header className="flex min-w-0 flex-col gap-4 rounded-xl border bg-background/80 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <Button
                            asChild
                            aria-label="Back to invitation workspace"
                            size="icon"
                            title="Back to invitation workspace"
                            variant="ghost"
                        >
                            <Link href={invitationShow(invitation.id)}>
                                <ArrowLeft />
                            </Link>
                        </Button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <Sparkles className="size-4 shrink-0 text-primary" />
                                <h1 className="truncate text-lg font-semibold">
                                    {invitation.name}
                                </h1>
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Design</span>
                                <select
                                    aria-label="Active design"
                                    className="max-w-48 truncate rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    onChange={(event) =>
                                        switchDesign(event.target.value)
                                    }
                                    value={invitation.activeDesign.id}
                                >
                                    {invitation.designs
                                        .filter((design) => !design.isArchived)
                                        .map((design) => (
                                            <option
                                                key={design.id}
                                                value={design.id}
                                            >
                                                {design.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant={
                                saveState === 'failed'
                                    ? 'destructive'
                                    : 'secondary'
                            }
                        >
                            {saveState === 'saved' && (
                                <Check className="mr-1 size-3" />
                            )}
                            {saveLabels[saveState]}
                        </Badge>
                        <Button
                            disabled={saveState === 'saving'}
                            onClick={saveDocument}
                            type="button"
                        >
                            <Save />
                            {saveState === 'saving' ? 'Saving…' : 'Save'}
                        </Button>
                        <Button asChild variant="outline">
                            <Link
                                href={designs.preview.url({
                                    invitation: invitation.id,
                                    design: invitation.activeDesign.id,
                                })}
                            >
                                <Eye />
                                Preview
                            </Link>
                        </Button>
                    </div>
                </header>

                {errors.document && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {errors.document}
                    </div>
                )}

                <div className="grid min-w-0 gap-4 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] lg:items-start">
                    <DocumentOutline
                        document={state.document}
                        dispatch={dispatchDocument}
                        selection={state.selection}
                    />
                    <main className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background/80 px-4 py-3 shadow-sm">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                                    Canvas
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Changes stay local until you explicitly
                                    save.
                                </p>
                            </div>
                            <ToggleGroup
                                onValueChange={(value) => {
                                    if (value) {
                                        dispatchDocument({
                                            type: 'set-viewport',
                                            viewport: value as
                                                | 'mobile'
                                                | 'tablet'
                                                | 'desktop',
                                        });
                                    }
                                }}
                                type="single"
                                value={state.viewport}
                                variant="outline"
                            >
                                {(['mobile', 'tablet', 'desktop'] as const).map(
                                    (viewport) => (
                                        <ToggleGroupItem
                                            className="capitalize"
                                            key={viewport}
                                            value={viewport}
                                        >
                                            {viewport}
                                        </ToggleGroupItem>
                                    ),
                                )}
                            </ToggleGroup>
                        </div>
                        <InvitationCanvas
                            document={state.document}
                            media={invitation.media}
                            onSelect={(selection) =>
                                dispatchDocument({ type: 'select', selection })
                            }
                            selection={state.selection}
                            viewport={state.viewport}
                        />
                    </main>
                    <PropertiesPanel
                        document={state.document}
                        dispatch={dispatchDocument}
                        errors={errors}
                        media={invitation.media}
                        onUpload={uploadImage}
                        uploadMessage={
                            uploading ? 'Uploading image…' : uploadMessage
                        }
                        selection={state.selection}
                    />
                </div>
            </div>
        </>
    );
}

InvitationsEditor.layout = InvitationLayout;
