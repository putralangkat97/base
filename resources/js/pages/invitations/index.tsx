import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays, Plus, Sparkles } from 'lucide-react';
import CreateInvitationDialog from '@/components/vowly/create-invitation-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InvitationLayout from '@/layouts/vowly/invitation-layout';
import { formatUpdatedAt } from '@/lib/format-date';
import { show } from '@/routes/vowly/invitations';
import type { InvitationSummary } from '@/types';

type Props = {
    invitations: InvitationSummary[];
};

export default function InvitationsIndex({ invitations }: Props) {
    return (
        <>
            <Head title="Invitations" />

            <div className="space-y-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div className="space-y-2">
                        <Badge variant="secondary">Vowly workspace</Badge>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Your invitations
                        </h1>
                        <p className="max-w-xl text-muted-foreground">
                            Keep each wedding project focused, private, and
                            ready for its next design decision.
                        </p>
                    </div>

                    <CreateInvitationDialog>
                        <Button data-test="new-invitation-button">
                            <Plus />
                            New invitation
                        </Button>
                    </CreateInvitationDialog>
                </div>

                {invitations.length === 0 ? (
                    <Card className="border-dashed bg-background/80">
                        <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <Sparkles className="size-7" />
                            </span>
                            <h2 className="text-xl font-semibold tracking-tight">
                                Your first invitation starts here
                            </h2>
                            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                                Create a private workspace and get an active
                                Untitled design ready for the editor.
                            </p>
                            <CreateInvitationDialog>
                                <Button className="mt-6">
                                    <Plus />
                                    Create invitation
                                </Button>
                            </CreateInvitationDialog>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {invitations.map((invitation) => (
                            <Card
                                className="group bg-background/80 transition-colors hover:border-primary/40"
                                data-test="invitation-card"
                                key={invitation.id}
                            >
                                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">
                                            {invitation.name}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {formatUpdatedAt(
                                                invitation.updatedAt,
                                            )}
                                        </p>
                                    </div>
                                    <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                        <CalendarDays className="size-4" />
                                    </span>
                                </CardHeader>
                                <CardContent className="flex items-end justify-between gap-4">
                                    <div className="space-y-1 text-sm">
                                        <p className="text-muted-foreground">
                                            Active design
                                        </p>
                                        <p className="font-medium">
                                            {invitation.activeDesignName ??
                                                'No active design'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {invitation.designCount}{' '}
                                            {invitation.designCount === 1
                                                ? 'design'
                                                : 'designs'}
                                        </p>
                                    </div>
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={show(invitation.id)}>
                                            Open workspace
                                            <ArrowRight />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

InvitationsIndex.layout = InvitationLayout;
