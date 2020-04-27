# Combo box without managed focus

A combo box without managed focus.

The focus remains in the input, and the currently selected item is set by `aria-activedescendant`.

This is technically correct and makes editing the input value easier. However, it is found to be unreliable in many screen-readers and requires additional code to keep the selected option on the screen.
