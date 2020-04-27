# ARIA 1.0 combo box

This modified the combo box to use the ARIA 1.0 pattern.

The difference is `aria-owns` is used instead of `aria-controls`.  This creates a confusing accessibility tree
as the list box becomes a child of the textbox.

There is no need to use this pattern as all screen-readers are compatible with the default ARIA 1.2 pattern.

