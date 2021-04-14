# Highlighters

Highlighters can be used to highlight which parts of the search results match the search term.

To use the `renderValue` prop should be replaced with an appropriate highlight function for the search type.

```js
const [options, onSearch] = useTokenSearch(initialOptions);

<ComboBox
  options={options}
  onSearch={onSearch}
  renderValue={tokenHighlight()}
/>
```

Five highlights are provided, or you could build your own.

All highlights also support an inverse option.  This is useful for highlighting search suggestions.

```js
<ComboBox
  {...props}
  renderValue={tokenHighlight({ inverse: true })}
/>
```

## `delimitedHighlight`

Adds highlighting to a string that already contains delimiters marking the highlight.

For example elastic search will return highlighted strings that look like:
`foo <em>bar</em>`.

You need to pass the start and end delimiters to the highlight.

```js
<ComboBox
  {...props}
  renderValue={delimitedHighlight({ start: '<em>', end: '</em>' })}
/>
```

## `passThroughHightlight`

This passes the input through without highlighting anything.

## `prefixHighlight`

Highlights where the search term appears at the start of the string.

Left trims and matches case insensitively.

## `substringHighlight`

Highlights where the search term matches part of a string.

Left trims and matches case insensitively.

Useful for highlighting a database ilike query.

## `tokenHighlight`

Highlights matching tokens from a token search.

## Custom highlighters and `highlightValue`

To create your own highlighter you need to create a method with the following signature:

`function (term: String, query: String, options: Object, state, props): Array<String|Array<String>>,`

- `term` The term to highlight
- `query` The search query to highlight with
- `options` Any additional props passed to the component
- `state` The state of the component for that value
- `props` The props passed to component

This should return an array whose members are strings or a single item array.  For example:

`foo<mark>bar</mark> foe` would be represented as `['foo', ['bar'], ' foe']`

You can pass this highlighter to `highlightValue`.

```javascript
<ComboBox
  {...props}
  renderValue={highlightValue(myCustomHighlighter,  { any: 'options' })}
/>
```

You can compose a highlighter using the existing highlighters.  They are:

- `delimitedHighlighter`
- `passThroughHighlighter`
- `tokenHighlighter`
- `prefixHighligher`
- `substringHighlighter`
- `tokenHighlighter`

```javascript
function highlight(term, search, options, state, props) {
  // If the term is foo highlight
  if (term === 'foo') {
    return tokenHighlighter(...arguments);
  }

  // Otherwise don't highlight
  return passThroughHighlighter(...arguments);
}

<ComboBox
  {...props}
  renderValue={highlightValue(highlight)}
/>
```
