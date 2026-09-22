# 01: Validate Variant A editor prototype

**What to build:** A throwaway authenticated prototype for validating the three-pane editor hierarchy before production implementation. It uses mock data and in-memory state only.

**Blocked by:** None (can start immediately).

**Status:** claimed

### UI requirements

- Left rail contains a Section outline, an Add section action, and Text, Image, and Button block actions.
- Center area contains an Invitation canvas on a paper-like surface with a clear selected-node outline and empty-state guidance.
- Right rail contains selected-block properties and an empty state when nothing is selected.
- Top bar contains a prototype label, Design name, save indicator, and Preview control.
- Desktop, tablet, and mobile viewport controls are visible.

### Implementation constraints

- Use mock data and in-memory state only.
- Do not add database writes, backend mutations, or fake persistence.
- Use existing shadcn/ui, Lucide, Tailwind theme tokens, dark-mode, and responsive conventions.
- Use typed React props and local typed reducer/command state; do not introduce a global state library.
- Keep the prototype clearly separate from production components.

- [ ] Authenticated User can open the prototype route.
- [ ] Selection, add, edit, duplicate, remove, and reorder interactions work in memory.
- [ ] Desktop, tablet, and mobile viewport changes update the canvas presentation.
- [ ] The prototype works in light and dark mode.
- [ ] Keyboard focus is visible and interactive controls have accessible names.
- [ ] The prototype is not added to normal Vowly navigation.

## Comments

- Claimed for implementation as the first unblocked Vowly ticket.
