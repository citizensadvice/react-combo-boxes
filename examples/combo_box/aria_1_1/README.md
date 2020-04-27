# ARIA 1.1 combo box

A combo box using the ARIA 1.1 pattern.

The ARIA 1.0 pattern created a confusing accessibility tree as the listbox became a child of the textbox.

The 1.1 pattern attempted to resolve this by creating a composite widget made from a combobox with a child textbox.
This actually created a more problems then it solved and eventually this [was resolved with the ARIA 1.2 pattern][1].

This example creates the ARIA 1.1 pattern.  While it is technically valid, it is not recommended and is only here as an example.

[1]: https://github.com/w3c/aria/wiki/Resolving-ARIA-1.1-Combobox-Issues
