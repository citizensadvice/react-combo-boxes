# Searching

The combo box will call an `onSearch` event when the user types a search term.
The application should use this to filter the options provided to the combo box.

You can handle this yourself and maintain a centralised state, or some hooks have been provided.

## `useSearch(searcher, { initialOptions, debounce, minLength, emptyOptions })`

```javascript
function async search(term) {
  const url = new URL(endpoint);
  url.searchParams.set('query', term);

  return (await fetch(url)).json();
}

const [filteredOptions, onSearch, busy] = useSearch(fn, { initialOptions, debounce, minLength });
```

Use a custom search function.  `async function (search: String): any`.
The search function can be an async function.  Usually it will return an array of results, but
it can return anything.  It can also return `null` which will keep the current set of results.

This will set `busy` to true while searching, optionally can debounce search results, and prevents out-of-sync async returns
from overwriting the results.

- `initialOptions` (`Array`) Options to initially populate the search with
- `emptyOptions` (`Array`) Options to show if there is no search term
- `debounce` (`Number`) milliseconds to debounce the search 
- `minLength` (`Number`) minimum number of characters to supply to make a search.

## `useTokenSearch(options, { index, tokenise, minLength, maxResults })`

```javascript
const [filteredOptions, onSearch] = useTokenSearch(options);
```

Searches an array of options for matching words.  This will split each option into words, and return any option where a word starts
with the search term.

By default it will search either strings, or `label` property if the options are objects.
Customise this by providing an index function with the signature `function (option: Object): Array<String>`.

The tokeniser can also be replaced.  This is function with the signature `function (string: String): Array<String>`

## `usePrefixSearch(options, { index, minLength, maxResults })`

```javascript
const [filteredOptions, onSearch] = usePrefixSearch(options);
```

Searches an array of options for a matching prefix.  This will find options starting with the search term.

By default it will search either strings, or `label` property if the options are objects.
Customise this by providing an index function with the signature `function (option: Object): String`.
