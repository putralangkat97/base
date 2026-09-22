import { Form, Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { index } from '@/routes/vowly/invitations';
import { logout } from '@/routes';

export default function InvitationLayout({ children }: PropsWithChildren) {
    const { auth, name } = usePage().props;

    return (
        <div className="min-h-screen bg-muted/30 text-foreground">
            <header className="border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link
                        className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        href={index()}
                    >
                        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Sparkles className="size-4" />
                        </span>
                        <span className="font-semibold tracking-tight">
                            {name}
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-muted-foreground sm:inline">
                            {auth.user.email}
                        </span>
                        <Form {...logout.form()}>
                            {({ processing }) => (
                                <Button
                                    aria-label="Log out"
                                    disabled={processing}
                                    size="icon"
                                    type="submit"
                                    variant="ghost"
                                >
                                    <LogOut />
                                </Button>
                            )}
                        </Form>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
