import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Eye } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import InvitationCanvas from '@/components/vowly/editor/invitation-canvas';
import InvitationLayout from '@/layouts/vowly/invitation-layout';
import { editor } from '@/routes/vowly/invitations/designs';
import type { Viewport } from '@/types/design-document';
import type { EditorWorkspace } from '@/types/invitations';

type Props = {
    invitation: EditorWorkspace;
};

export default function InvitationsPreview({ invitation }: Props) {
    const [viewport, setViewport] = useState<Viewport>('desktop');

    return (
        <>
            <Head title={`${invitation.name} preview`} />
            <div className="space-y-5">
                <header className="flex flex-col gap-4 rounded-xl border bg-background/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            aria-label="Back to editor"
                            size="icon"
                            title="Back to editor"
                            variant="ghost"
                        >
                            <Link
                                href={editor({
                                    invitation: invitation.id,
                                    design: invitation.activeDesign.id,
                                })}
                            >
                                <ArrowLeft />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <Eye className="size-4 text-primary" />
                                <h1 className="text-lg font-semibold">
                                    Private preview
                                </h1>
                                <Badge variant="secondary">Saved only</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {invitation.name} ·{' '}
                                {invitation.activeDesign.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(['mobile', 'tablet', 'desktop'] as const).map(
                            (candidate) => (
                                <Button
                                    key={candidate}
                                    onClick={() => setViewport(candidate)}
                                    size="sm"
                                    variant={
                                        viewport === candidate
                                            ? 'default'
                                            : 'outline'
                                    }
                                >
                                    <span className="capitalize">
                                        {candidate}
                                    </span>
                                </Button>
                            ),
                        )}
                    </div>
                </header>
                <div className="rounded-xl border bg-background/50 p-2 shadow-sm sm:p-4">
                    <InvitationCanvas
                        document={invitation.activeDesign.document}
                        media={invitation.media}
                        selection={null}
                        viewport={viewport}
                        readOnly
                    />
                </div>
            </div>
        </>
    );
}

InvitationsPreview.layout = InvitationLayout;
