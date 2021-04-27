# Combo box search suggestions

A combo box setup to behave like the search suggestions on the Google home page.

- the value is updated both by `onSearch` and `onValue`
- `showSelectedLabel` is enabled to update value in the input as the selects different options.
- `expandOnFocus` is disabled so you have to type to see results
- The highlighter is set to inverse to highlight the completion.

The token search is used here.  In reality the search suggestions would be returned by a search engine.

You maybe better using a native `<datalist>` if wish to build search suggestions.
