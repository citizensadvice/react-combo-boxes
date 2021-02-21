# Combo box with background autocomplete

This demonstrates the search working like the autocomplete on the Google Mail search bar.

Try typing `in:`, `is:`, `from:` or `to:` for example.

Pressing tab will complete the suggestion.  A disabled 'ghost' input is placed behind the main input to
show the autocomplete suggestion.

> :warning: **Warning** a screen-reader will not know there is an
> auto-selected suggestion, which might be confusing.

You can toggle between an theoretically accessible version by setting autoselect to `"inline"`.
