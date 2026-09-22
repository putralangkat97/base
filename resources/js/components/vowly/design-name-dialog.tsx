import { Form } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store } from '@/routes/vowly/invitations/designs';
import { update } from '@/routes/vowly/invitations/designs';

type Props = PropsWithChildren<{
    invitationId: number;
    designId?: number;
    currentName?: string;
}>;

type FormAction = {
    action: string;
    method: 'patch' | 'post';
};

export default function DesignNameDialog({
    children,
    invitationId,
    designId,
    currentName = '',
}: Props) {
    const [open, setOpen] = useState(false);
    const isRenaming = designId !== undefined;
    const form: FormAction = isRenaming
        ? update.form({ invitation: invitationId, design: designId })
        : store.form(invitationId);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <Form
                    key={`${String(open)}-${currentName}`}
                    {...form}
                    className="space-y-6"
                    onSuccess={() => setOpen(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            <DialogHeader>
                                <DialogTitle>
                                    {isRenaming
                                        ? 'Rename design'
                                        : 'Create a design draft'}
                                </DialogTitle>
                                <DialogDescription>
                                    {isRenaming
                                        ? 'Use a short name that makes this direction easy to recognize.'
                                        : 'New drafts start inactive so your current preview stays unchanged.'}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-2">
                                <Label htmlFor="design-name">Design name</Label>
                                <Input
                                    autoFocus
                                    defaultValue={currentName}
                                    id="design-name"
                                    name="name"
                                    placeholder="Classic"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button disabled={processing} type="submit">
                                    {isRenaming ? 'Save name' : 'Create draft'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
