import { Form } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type Props = PropsWithChildren<{
    action: {
        action: string;
        method: 'delete' | 'post';
    };
    confirmLabel: string;
    description: string;
    title: string;
}>;

export default function DesignConfirmationDialog({
    action,
    children,
    confirmLabel,
    description,
    title,
}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <Form
                    {...action}
                    className="space-y-6"
                    onSuccess={() => setOpen(false)}
                >
                    {({ processing }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>{title}</DialogTitle>
                                <DialogDescription>
                                    {description}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button
                                    disabled={processing}
                                    type="submit"
                                    variant="destructive"
                                >
                                    {confirmLabel}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
