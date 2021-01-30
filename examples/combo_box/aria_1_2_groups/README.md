# Combo box with ARIA 1.2 groups

A combo box modified to use ARIA 1.2 groups.

The group role is not allowed as a child of a listbox in ARIA 1.1 and consequently is not supported in the majority of screen readers.

In [ARIA 1.2][1] the group role is now allowed.

In the main implementation groups are simulated with a visual text label, and hidden text for screen-readers.
This examples modifies the combo-box to use true groups.

[1]: https://www.w3.org/TR/wai-aria-1.2/#substantive-changes-since-the-wai-aria-1-1-recommendation
