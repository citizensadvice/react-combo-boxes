# Drop down without managed focus

`managedFocus` is disabled. This means the focus remains in the combox box element
and does not follow the selected option. Instead `aria-activedescendant` sets
the focused option.

The default is to use `managedFocus` as this has the best browser and screen-reader compatibility.
