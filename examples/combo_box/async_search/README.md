# Combo box with async search

This demonstrates a combo box with an async search.  The search will return the results
of the token search randomly between 0 and 1 seconds after typing.

In a real application the results would probably be the result of a `fetch` request.

You can adjust the debounce options.  Some screen-readers become overlay chatty if `aria-busy`
is toggled too often.
