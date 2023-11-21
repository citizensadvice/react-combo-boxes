# Searching

The combo box will call an `onSearch` event when the user types a search term.
The application should use this to filter the options provided to the combo box.

You can handle this yourself, or some hooks have been provided for some common cases.

A simple implementation to filter an array of strings would be:

```js
const [value, setValue] = useState();
const [search, setSearch] = useState();

const allOptions = ['Apple', 'Orange', 'Banana'];

const options = useMemo(() => (
  allOptions.filter((value) => value.toLowerCase().startsWith(search.toLowerCase())
), [search]);

<ComboBox
  value={value}
  options={options}
  onValue={setValue}
  onSearch={setSearch}
/>
```

## `useAsyncSearch(term: string, { searcher: Searcher, debounce: number, catchErrors: boolean = false })`

This wraps a search function. It supports debouncing, catching errors and cancelling requests.

Returns an array of `[results: any, busy: boolean, error: Error]`

- `results`: whatever the searcher returns
- `busy`: true while searching, false while not searching
- `error`: if `catchErrors` is true, a caught error will be set here.

Options:

- `searcher` (`async (search: string, { signal }: { signal: AbortSignal }) => any`) **Required**, a function to search.
  First argument is the query. Also passes the signal of an `AbortController` for cancelling requests.
- `debounce` (`number`) milliseconds to debounce the search
- `catchErrors` (`boolean`) if true, catch errors and return them as the third array argument.

Example:

```javascript

const [value, setValue] = useState();
const [search, setSearch] = useState();

const searcher = useCallback((query, { signal }) => {
  if (!query) {
    return []
  }
  const url = new URL(apiUrl);
  url.searchParams.set('query', query);
  const response = await fetch(url, { signal });
  return await response.json();
}, [apiUrl]);

const [options, busy, error] = useSearch(search, { searcher, catchErrors: true });

<ComboBox
  value={value}
  options={options}
  busy={busy}
  onValue={setValue}
  onSearch={setSearch}
/>
```

## `useTokenSearch(query, { options, index, tokenise, minLength, maxResults })`

```javascript
const filteredOptions = useTokenSearch(query, { options });
```

Searches an array of options. The options are split into words. When searching
any options containing a word starting with the search term will be returned.

By default it will search either strings, or `label` property if the options are objects.

You can customise how the array indexed by providing an index function with the signature `function (option: Object): Array<String>`.

The tokeniser can also be replaced. This is function with the signature `function (string: String): Array<String>`

## `usePrefixSearch(query, { options, index, minLength, maxResults })`

```javascript
const filteredOptions = usePrefixSearch(query, { options });
```

Searches an array of options for a matching prefix. This will find options starting with the search term.

By default it will search either strings, or `label` property if the options are objects.

You can customise how the array indexed by providing an index function with the signature `function (option: Object): Array<String>`.
