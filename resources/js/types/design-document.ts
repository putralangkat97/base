export type Viewport = 'mobile' | 'tablet' | 'desktop';

export type GridGap = 'sm' | 'md' | 'lg';

export type GridLayout = 'stack' | 'grid';

export type TextBlock = {
    id: string;
    type: 'text';
    label: string;
    content: string;
    align: 'left' | 'center' | 'right';
};

export type ImageBlock = {
    id: string;
    type: 'image';
    label: string;
    mediaId: string | null;
    alt: string;
};

export type ButtonBlock = {
    id: string;
    type: 'button';
    label: string;
    text: string;
    href: string;
};

export type DesignBlock = TextBlock | ImageBlock | ButtonBlock;

export type DesignGrid = {
    id: string;
    type: 'grid';
    layout?: GridLayout;
    columns: 1 | 2 | 3;
    gap: GridGap;
    stackAt: 'mobile' | 'tablet';
};

export type DesignContainer = {
    id: string;
    type: 'container';
    label: string;
    grid: DesignGrid;
    blocks: DesignBlock[];
};

export type DesignSection = {
    id: string;
    type: 'section';
    label: string;
    containers: DesignContainer[];
};

export type DesignDocument = {
    schemaVersion: 1;
    responsive: {
        mode: 'single-document';
        breakpoints: ['mobile', 'tablet', 'desktop'];
    };
    sections: DesignSection[];
};

export type DesignMedia = {
    id: number;
    url: string;
    mimeType: string;
    width: number | null;
    height: number | null;
};

export type Selection =
    | { kind: 'section'; id: string }
    | { kind: 'container'; id: string }
    | { kind: 'block'; id: string }
    | null;

export type EditorSaveState =
    | 'clean'
    | 'unsaved'
    | 'saving'
    | 'saved'
    | 'failed';

export type EditorState = {
    document: DesignDocument;
    selection: Selection;
    viewport: Viewport;
};

export type DocumentAction =
    | { type: 'select'; selection: Selection }
    | { type: 'set-viewport'; viewport: Viewport }
    | { type: 'add-section' }
    | { type: 'update-section'; id: string; label: string }
    | { type: 'duplicate-section'; id: string }
    | { type: 'remove-section'; id: string }
    | { type: 'move-section'; id: string; direction: 'up' | 'down' }
    | { type: 'add-container'; sectionId: string }
    | { type: 'update-container'; id: string; label: string }
    | { type: 'update-grid'; id: string; changes: Partial<DesignGrid> }
    | { type: 'add-block'; kind: DesignBlock['type'] }
    | { type: 'update-block'; id: string; changes: Partial<DesignBlock> }
    | { type: 'duplicate-block'; id: string }
    | { type: 'remove-block'; id: string }
    | { type: 'move-block'; id: string; direction: 'up' | 'down' };
