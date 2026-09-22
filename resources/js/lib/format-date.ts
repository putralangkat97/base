export const formatUpdatedAt = (value: string | null): string => {
    if (!value) {
        return 'Not updated yet';
    }

    return `Updated ${new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
    }).format(new Date(value))}`;
};
