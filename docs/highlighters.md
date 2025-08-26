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

The highlight is created using the [CSS custom highlight api](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API).

They are styled using:

```css
::highlight(react-combo-boxes) {
  background-color: peachpuff;
}
```

Four highlight components are provided, or you could build your own.

## Available highlighters

All highlighters accept an `inverse` option that will inverse the highlight.

### `DelimitedHighlight`

Adds highlighting to a string that already contains delimiters marking the highlight.

For example elastic search will return highlighted strings that look like:
`foo <em>bar</em>`.

```js
<DelimitedHighlight
  value="foo<em>bar</em>"
  start="<em>"
  end="</em>"
/>
// foo*bar*
```

### `PrefixHighlight`

Highlights where the search term appears at the start of the string.

Left trims and matches case insensitively.

```js
<PrefixHighlight
  value="foo bar fo"
  search="fo"
/>
// *fo*o bar *fo*
```

### `SubstringHighlight`

Highlights where the search term matches part of a string.

Left trims and matches case insensitively.

Useful for highlighting a database ilike query.

```js
<SubstringHighlight
  value="foo barfoo"
  search="foo"
/>
// *foo* bar*foo*
```

### `TokenHighlight`

Highlights matching tokens from a token search.

```js
<TokenHighlight
  value="foo foobar barfoo"
  search="foo"
/>
// *foo* *foo*bar barfoo
```

### `Highlight`

Creates a generic highlight.

The children should be an array whose members are strings or a single item array. For example:
`foo<mark>bar</mark> foe` would be represented as `['foo', ['bar'], ' foe']`

```js
<Highlight>{['foo', ['bar'], ' foe']}</Highlight>
// foo*bar* foe
```
