# ARIA 1.0 combo box

This modifies the combo box to use the ARIA 1.0 pattern. In this pattern the listbox is connected to the
textbox via `aria-owns` instead of `aria-controls`.

The ARIA 1.0 pattern creates a confusing accessibility tree as the listbox became a child of the textbox.

This pattern has been deprecated.
