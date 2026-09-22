import type {
    ButtonBlock,
    DesignBlock,
    DesignContainer,
    DesignDocument,
    DesignGrid,
    DesignSection,
    DocumentAction,
    EditorState,
    ImageBlock,
    Selection,
    TextBlock,
} from '@/types/design-document';

export const emptyDesignDocument: DesignDocument = {
    schemaVersion: 1,
    responsive: {
        mode: 'single-document',
        breakpoints: ['mobile', 'tablet', 'desktop'],
    },
    sections: [],
};

let fallbackId = 0;

function nodeId(prefix: string): string {
    fallbackId += 1;

    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
    }

    return `${prefix}-${fallbackId}`;
}

export function makeEmptyState(document: DesignDocument): EditorState {
    return {
        document,
        selection: firstSelection(document),
        viewport: 'desktop',
    };
}

export function firstSelection(document: DesignDocument): Selection {
    const section = document.sections[0];

    if (!section) {
        return null;
    }

    return { kind: 'section', id: section.id };
}

export function selectedNode(
    document: DesignDocument,
    selection: Selection,
): DesignSection | DesignContainer | DesignBlock | null {
    if (!selection) {
        return null;
    }

    for (const section of document.sections) {
        if (selection.kind === 'section' && section.id === selection.id) {
            return section;
        }

        for (const container of section.containers) {
            if (
                selection.kind === 'container' &&
                container.id === selection.id
            ) {
                return container;
            }

            const block = container.blocks.find(
                (candidate) =>
                    selection.kind === 'block' && candidate.id === selection.id,
            );

            if (block) {
                return block;
            }
        }
    }

    return null;
}

function updateDocument(
    state: EditorState,
    document: DesignDocument,
    selection: Selection = state.selection,
): EditorState {
    return { ...state, document, selection };
}

function reorder<T>(items: T[], index: number, direction: 'up' | 'down'): T[] {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;

    if (index < 0 || nextIndex < 0 || nextIndex >= items.length) {
        return items;
    }

    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [
        nextItems[nextIndex],
        nextItems[index],
    ];

    return nextItems;
}

function findBlockLocation(document: DesignDocument, id: string) {
    for (const [sectionIndex, section] of document.sections.entries()) {
        for (const [
            containerIndex,
            container,
        ] of section.containers.entries()) {
            const blockIndex = container.blocks.findIndex(
                (block) => block.id === id,
            );

            if (blockIndex !== -1) {
                return { sectionIndex, containerIndex, blockIndex };
            }
        }
    }

    return null;
}

function findContainerLocation(document: DesignDocument, id: string) {
    for (const [sectionIndex, section] of document.sections.entries()) {
        const containerIndex = section.containers.findIndex(
            (container) => container.id === id,
        );

        if (containerIndex !== -1) {
            return { sectionIndex, containerIndex };
        }
    }

    return null;
}

function containerForSelection(
    document: DesignDocument,
    selection: Selection,
): { sectionIndex: number; containerIndex: number } | null {
    if (selection?.kind === 'container') {
        return findContainerLocation(document, selection.id);
    }

    if (selection?.kind === 'block') {
        const location = findBlockLocation(document, selection.id);

        if (location) {
            return {
                sectionIndex: location.sectionIndex,
                containerIndex: location.containerIndex,
            };
        }
    }

    if (selection?.kind === 'section') {
        const sectionIndex = document.sections.findIndex(
            (section) => section.id === selection.id,
        );

        if (sectionIndex !== -1) {
            return { sectionIndex, containerIndex: 0 };
        }
    }

    return document.sections[0]?.containers[0]
        ? { sectionIndex: 0, containerIndex: 0 }
        : null;
}

function defaultGrid(): DesignGrid {
    return {
        id: nodeId('grid'),
        type: 'grid',
        layout: 'stack',
        columns: 1,
        gap: 'md',
        stackAt: 'mobile',
    };
}

function defaultContainer(label = 'New container'): DesignContainer {
    return {
        id: nodeId('container'),
        type: 'container',
        label,
        grid: defaultGrid(),
        blocks: [],
    };
}

function defaultBlock(kind: DesignBlock['type']): DesignBlock {
    const id = nodeId('block');

    if (kind === 'text') {
        return {
            id,
            type: 'text',
            label: 'New text block',
            content: 'Write invitation content here.',
            align: 'left',
        } satisfies TextBlock;
    }

    if (kind === 'image') {
        return {
            id,
            type: 'image',
            label: 'New image block',
            mediaId: null,
            alt: 'Invitation image',
        } satisfies ImageBlock;
    }

    return {
        id,
        type: 'button',
        label: 'New button block',
        text: 'Open invitation',
        href: 'https://example.com',
    } satisfies ButtonBlock;
}

function cloneBlock(block: DesignBlock): DesignBlock {
    return { ...block, id: nodeId('block'), label: `${block.label} copy` };
}

function cloneSection(section: DesignSection): DesignSection {
    return {
        ...section,
        id: nodeId('section'),
        label: `${section.label} copy`,
        containers: section.containers.map((container) => ({
            ...container,
            id: nodeId('container'),
            grid: { ...container.grid, id: nodeId('grid') },
            blocks: container.blocks.map(cloneBlock),
        })),
    };
}

function updateContainer(
    document: DesignDocument,
    id: string,
    update: (container: DesignContainer) => DesignContainer,
): DesignDocument {
    return {
        ...document,
        sections: document.sections.map((section) => ({
            ...section,
            containers: section.containers.map((container) =>
                container.id === id ? update(container) : container,
            ),
        })),
    };
}

function updateBlockContainer(
    document: DesignDocument,
    blockId: string,
    update: (container: DesignContainer) => DesignContainer,
): DesignDocument {
    return {
        ...document,
        sections: document.sections.map((section) => ({
            ...section,
            containers: section.containers.map((container) =>
                container.blocks.some((block) => block.id === blockId)
                    ? update(container)
                    : container,
            ),
        })),
    };
}

export function designDocumentReducer(
    state: EditorState,
    action: DocumentAction,
): EditorState {
    switch (action.type) {
        case 'select':
            return { ...state, selection: action.selection };
        case 'set-viewport':
            return { ...state, viewport: action.viewport };
        case 'add-section': {
            const section: DesignSection = {
                id: nodeId('section'),
                type: 'section',
                label: `New section ${state.document.sections.length + 1}`,
                containers: [defaultContainer()],
            };

            return updateDocument(
                state,
                {
                    ...state.document,
                    sections: [...state.document.sections, section],
                },
                { kind: 'section', id: section.id },
            );
        }
        case 'update-section':
            return updateDocument(state, {
                ...state.document,
                sections: state.document.sections.map((section) =>
                    section.id === action.id
                        ? { ...section, label: action.label }
                        : section,
                ),
            });
        case 'duplicate-section': {
            const index = state.document.sections.findIndex(
                (section) => section.id === action.id,
            );

            if (index === -1) {
                return state;
            }

            const section = cloneSection(state.document.sections[index]);
            const sections = [...state.document.sections];
            sections.splice(index + 1, 0, section);

            return updateDocument(
                state,
                { ...state.document, sections },
                { kind: 'section', id: section.id },
            );
        }
        case 'remove-section': {
            const sections = state.document.sections.filter(
                (section) => section.id !== action.id,
            );

            return updateDocument(
                state,
                { ...state.document, sections },
                firstSelection({ ...state.document, sections }),
            );
        }
        case 'move-section': {
            const index = state.document.sections.findIndex(
                (section) => section.id === action.id,
            );

            return updateDocument(state, {
                ...state.document,
                sections: reorder(
                    state.document.sections,
                    index,
                    action.direction,
                ),
            });
        }
        case 'add-container': {
            const container = defaultContainer();
            const document = {
                ...state.document,
                sections: state.document.sections.map((section) =>
                    section.id === action.sectionId
                        ? {
                              ...section,
                              containers: [...section.containers, container],
                          }
                        : section,
                ),
            };

            return updateDocument(state, document, {
                kind: 'container',
                id: container.id,
            });
        }
        case 'update-container':
            return updateDocument(
                state,
                updateContainer(state.document, action.id, (container) => ({
                    ...container,
                    label: action.label,
                })),
            );
        case 'update-grid':
            return updateDocument(
                state,
                updateContainer(state.document, action.id, (container) => ({
                    ...container,
                    grid: { ...container.grid, ...action.changes },
                })),
            );
        case 'add-block': {
            const location = containerForSelection(
                state.document,
                state.selection,
            );

            if (!location) {
                return state;
            }

            const block = defaultBlock(action.kind);
            const document = {
                ...state.document,
                sections: state.document.sections.map(
                    (section, sectionIndex) =>
                        sectionIndex !== location.sectionIndex
                            ? section
                            : {
                                  ...section,
                                  containers: section.containers.map(
                                      (container, containerIndex) =>
                                          containerIndex !==
                                          location.containerIndex
                                              ? container
                                              : {
                                                    ...container,
                                                    blocks: [
                                                        ...container.blocks,
                                                        block,
                                                    ],
                                                },
                                  ),
                              },
                ),
            };

            return updateDocument(state, document, {
                kind: 'block',
                id: block.id,
            });
        }
        case 'update-block':
            return updateDocument(
                state,
                updateBlockContainer(
                    state.document,
                    action.id,
                    (container) => ({
                        ...container,
                        blocks: container.blocks.map((block) =>
                            block.id === action.id
                                ? ({
                                      ...block,
                                      ...action.changes,
                                  } as DesignBlock)
                                : block,
                        ),
                    }),
                ),
            );
        case 'duplicate-block': {
            const location = findBlockLocation(state.document, action.id);

            if (!location) {
                return state;
            }

            const block = cloneBlock(
                state.document.sections[location.sectionIndex].containers[
                    location.containerIndex
                ].blocks[location.blockIndex],
            );

            return updateDocument(
                state,
                updateBlockContainer(state.document, action.id, (container) => {
                    const index = container.blocks.findIndex(
                        (candidate) => candidate.id === action.id,
                    );
                    const blocks = [...container.blocks];
                    blocks.splice(index + 1, 0, block);

                    return { ...container, blocks };
                }),
                { kind: 'block', id: block.id },
            );
        }
        case 'remove-block':
            return updateDocument(
                state,
                updateBlockContainer(
                    state.document,
                    action.id,
                    (container) => ({
                        ...container,
                        blocks: container.blocks.filter(
                            (block) => block.id !== action.id,
                        ),
                    }),
                ),
                firstSelection(state.document),
            );
        case 'move-block':
            return updateDocument(
                state,
                updateBlockContainer(state.document, action.id, (container) => {
                    const index = container.blocks.findIndex(
                        (block) => block.id === action.id,
                    );

                    return {
                        ...container,
                        blocks: reorder(
                            container.blocks,
                            index,
                            action.direction,
                        ),
                    };
                }),
            );
    }
}
