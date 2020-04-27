# Drop down without managed focus

`managedFocus` is disabled.  This means the focus remains in the combox box element
and does not follow the selected option.  Instead `aria-activedescendant` sets
the focused option.

While this is technically correct, it does not work well in all screen-readers.

