# Highlighters

Highlighters can be used to highlight which parts of the search results match the search term.

To use the `ValueComponent` prop should be replaced with an appropriate highlighter for the
search types.

```js
const [options, onSearch] = useTokenSearch(initialOptions);

<ComboBox
  options={options}
  onSearch={onSearch}
  ValueComponent={TokenHighlight}
/>
```

Five highlights are provided, or you could build your own.

All highlights also support an inverse option.  This is useful for highlighting search suggestions.

```js
<ComboBox
  {...props}
  ValueComponent={TokenHighlight}
  valueProps={{ inverse: true }}
/>
```

## `DelimitedHighlight`

Adds highlighting to a string that already contains delimiters marking the highlight.

For example elastic search will return highlighted strings that look like:
`foo <em>bar</em>`.

You need to pass the start and end delimiters to the highlight.

```js
<ComboBox
  {...props}
  ValueComponent={DelimitedHighlight}
  valueProps={{ start: '<em>', end: '</em>' }}
/>
```

## `PassThroughHightlight`

This passes the input through without highlighting anything.

## `PrefixHighlight`

Highlights where the search term appears at the start of the string.

Left trims and matches case insensitively.

## `SubstringHighlighter`

Highlights where the search term matches part of a string.

Left trims and matches case insensitively.

Useful for highlighting a database ilike query.

## `TokenHighlighter`

Highlights matching tokens from a token search.

## Custom highlighters

To create your own highlighter you need to create a method with the following signature:

`function (term: String, query: String, context: Object, props: Object): Array<String|Array<String>>`

- `term` The term to highlight
- `query` The search query to highlight with
- `context` The context from the component
- `props` Any additional props passed to the component

This should return an array whose members are strings or a single item array.  For example:

`foo<mark>bar</mark> foe` would be represented as `['foo', ['bar'], ' foe']`

You can pass this highlighter to `HighlightValue`.

```javascript
<ComboBox
  {...props}
  ValueComponent={HighlightValue}
  valueProps={{ highlight: myCustomHighlighter }}
/>
```
