# Highlighters

Highlighters can be used to highlight which parts of the search results match the search term.

```js
// Example that will highlight a token search

const [options, onSearch] = useTokenSearch(initialOptions);

function renderValue(_, { option: { label }, search) {
  return <TokenHighlight value={label} search={search} />;
}

<ComboBox
  options={options}
  onSearch={onSearch}
  renderValue={renderValue}
/>
```

Four highlight components are provided, or you could build your own.

## Available highlighters

All highlighters accept an `inverse` option that will inverse the highlight.

### `DelimitedHighlight`

Adds highlighting to a string that already contains delimiters marking the highlight.

For example elastic search will return highlighted strings that look like:
`foo <em>bar</em>`.

```js
  <DelimitedHighlight value="foo<em>bar</em>" start="<em>" end="</em>" />
  // <div>foo<mark>bar</mark></div>
```

### `PrefixHighlight`

Highlights where the search term appears at the start of the string.

Left trims and matches case insensitively.

```js
  <PrefixHighlight value="foo bar foo" search="foo" />
  // <div><mark>foo</mark> bar foo</div>
```

### `SubstringHighlight`

Highlights where the search term matches part of a string.

Left trims and matches case insensitively.

Useful for highlighting a database ilike query.

```js
  <SubstringHighlight value="foo barfoo" search="foo" />
  // <div><mark>foo</mark> bar<mark>foo</mark></div>
```

### `TokenHighlight`

Highlights matching tokens from a token search.

```js
  <TokenHighlight value="foo foobar barfoo" search="foo" />
  // <div><mark>foo</mark> <mark>foo</mark>bar barfoo</div>
```

### `Highlight`

Creates a generic highlight.

The children should be an array whose members are strings or a single item array.  For example:
`foo<mark>bar</mark> foe` would be represented as `['foo', ['bar'], ' foe']`

```js
  <Highlight>{['foo', ['bar'], ' foe']}</Highlight>
  // <div>foo<mark>bar</mark> foe</div>
```
