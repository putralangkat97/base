import { Form, Head, Link } from '@inertiajs/react';
import {
    Archive,
    ArrowLeft,
    Check,
    CopyPlus,
    FilePenLine,
    Layers3,
    Plus,
    RotateCcw,
    Trash2,
} from 'lucide-react';
import DesignConfirmationDialog from '@/components/vowly/design-confirmation-dialog';
import DesignNameDialog from '@/components/vowly/design-name-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InvitationLayout from '@/layouts/vowly/invitation-layout';
import { formatUpdatedAt } from '@/lib/format-date';
import { index } from '@/routes/vowly/invitations';
import {
    archive,
    destroy,
    restore,
    switchMethod,
} from '@/routes/vowly/invitations/designs';
import { editor } from '@/routes/vowly/invitations/designs';
import type { DesignSummary, InvitationWorkspace } from '@/types';

type Props = {
    invitation: InvitationWorkspace;
};

function DesignRow({
    design,
    invitation,
    hasReplacement,
}: {
    design: DesignSummary;
    invitation: InvitationWorkspace;
    hasReplacement: boolean;
}) {
    const routeArgs = {
        invitation: invitation.id,
        design: design.id,
    };

    return (
        <div
            className="flex flex-col gap-4 rounded-xl border bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between"
            data-test="design-row"
        >
            <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Layers3 className="size-4" />
                </span>
                <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{design.name}</p>
                        {design.isActive && <Badge>Active</Badge>}
                        {design.isArchived && (
                            <Badge variant="outline">Archived</Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {formatUpdatedAt(design.updatedAt)}
                    </p>
                    {design.isActive && !hasReplacement && (
                        <p className="text-xs text-muted-foreground">
                            Create another design before archiving this active
                            design.
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <DesignNameDialog
                    currentName={design.name}
                    designId={design.id}
                    invitationId={invitation.id}
                >
                    <Button size="sm" variant="ghost">
                        <FilePenLine />
                        Rename
                    </Button>
                </DesignNameDialog>

                {design.isArchived ? (
                    <Form {...restore.form(routeArgs)}>
                        {({ processing }) => (
                            <Button
                                disabled={processing}
                                size="sm"
                                type="submit"
                                variant="outline"
                            >
                                <RotateCcw />
                                Restore
                            </Button>
                        )}
                    </Form>
                ) : design.isActive ? (
                    <Button
                        disabled
                        size="sm"
                        title="The active design cannot be deleted. Archive it instead."
                        variant="outline"
                    >
                        <Check />
                        Active
                    </Button>
                ) : (
                    <Form {...switchMethod.form(routeArgs)}>
                        {({ processing }) => (
                            <Button
                                disabled={processing}
                                size="sm"
                                type="submit"
                                variant="outline"
                            >
                                <Check />
                                Make active
                            </Button>
                        )}
                    </Form>
                )}

                {design.isArchived || !design.isActive ? (
                    <DesignConfirmationDialog
                        action={destroy.form(routeArgs)}
                        confirmLabel="Delete design"
                        description="This permanently removes the inactive design draft. The active design is never deleted."
                        title="Delete this design?"
                    >
                        <Button size="sm" variant="ghost">
                            <Trash2 />
                            Delete
                        </Button>
                    </DesignConfirmationDialog>
                ) : (
                    <DesignConfirmationDialog
                        action={archive.form(routeArgs)}
                        confirmLabel="Archive design"
                        description="The active design will be archived and another available draft will become active."
                        title="Archive this design?"
                    >
                        <Button
                            disabled={!hasReplacement}
                            size="sm"
                            title={
                                hasReplacement
                                    ? undefined
                                    : 'Create another design before archiving the active design.'
                            }
                            variant="ghost"
                        >
                            <Archive />
                            Archive
                        </Button>
                    </DesignConfirmationDialog>
                )}
            </div>
        </div>
    );
}

export default function InvitationsShow({ invitation }: Props) {
    const activeDesigns = invitation.designs.filter(
        (design) => !design.isArchived,
    );
    const archivedDesigns = invitation.designs.filter(
        (design) => design.isArchived,
    );
    const hasReplacement = activeDesigns.length > 1;

    return (
        <>
            <Head title={invitation.name} />

            <div className="space-y-8">
                <div className="space-y-4">
                    <Button asChild className="-ml-3" size="sm" variant="ghost">
                        <Link href={index()}>
                            <ArrowLeft />
                            All invitations
                        </Link>
                    </Button>
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div className="space-y-2">
                            <Badge variant="secondary">Private workspace</Badge>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {invitation.name}
                            </h1>
                            <p className="max-w-xl text-muted-foreground">
                                Manage the design directions for this
                                invitation. Only one non-archived design is
                                active at a time.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {invitation.activeDesignId !== null && (
                                <Button asChild variant="outline">
                                    <Link
                                        href={editor({
                                            invitation: invitation.id,
                                            design: invitation.activeDesignId,
                                        })}
                                    >
                                        Open editor
                                    </Link>
                                </Button>
                            )}
                            <DesignNameDialog invitationId={invitation.id}>
                                <Button>
                                    <Plus />
                                    New design
                                </Button>
                            </DesignNameDialog>
                        </div>
                    </div>
                </div>

                <Card className="bg-background/80">
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <CardTitle>Design drafts</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Choose which direction is active for the
                                    private editor and preview.
                                </p>
                            </div>
                            <CopyPlus className="hidden size-5 text-muted-foreground sm:block" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {activeDesigns.map((design) => (
                            <DesignRow
                                design={design}
                                hasReplacement={hasReplacement}
                                invitation={invitation}
                                key={design.id}
                            />
                        ))}
                    </CardContent>
                </Card>

                {archivedDesigns.length > 0 && (
                    <Card className="bg-background/60">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Archived designs
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Archived directions stay private and can be
                                restored as inactive drafts.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {archivedDesigns.map((design) => (
                                <DesignRow
                                    design={design}
                                    hasReplacement={hasReplacement}
                                    invitation={invitation}
                                    key={design.id}
                                />
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

InvitationsShow.layout = InvitationLayout;
