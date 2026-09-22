export type InvitationSummary = {
    id: number;
    name: string;
    designCount: number;
    activeDesignName: string | null;
    updatedAt: string | null;
};

export type DesignSummary = {
    id: number;
    name: string;
    isActive: boolean;
    isArchived: boolean;
    updatedAt: string | null;
};

export type InvitationWorkspace = {
    id: number;
    name: string;
    activeDesignId: number | null;
    designs: DesignSummary[];
};
