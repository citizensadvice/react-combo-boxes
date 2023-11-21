# ARIA 1.2 combo box

This modified the combo box to use the ARIA 1.2 pattern.

The difference is `aria-controls` is used instead of `aria-owns` on the textbox.

This pattern creates a more logical accessibility tree, but causes issues with some screen-readers.
