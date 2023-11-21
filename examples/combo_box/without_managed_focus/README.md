# Combo box without managed focus

A combo box without managed focus.

The focus remains in the input, and the currently selected item is set by `aria-activedescendant`.

The default is to use `managedFocus` as this has the best backwards compatibility. However, note that Chrome on
a Mac defaults to `managedFocus=false` due to a bug in its integration with VoiceOver.
