# React combo box

[![npm version](https://badge.fury.io/js/@citizensadvice%2Freact-combo-boxes.svg)](https://badge.fury.io/js/@citizensadvice%2Freact-combo-boxes)

Combo boxes implemented in React.

The combo boxes follow the design patterns in [ARIA Authoring Practices guidelines][1] 

## Usage

See the [documentation and examples][2].

## Accessibility

See notes on [Accessibility][5]

## Styling

Basic SASS styles are provided in the styles directory.

## Test helper

A [test helper][4] is also provided.

## Development

```bash
npm install
npm start
```

See package.json for more commands.

## Releasing a new version

1. Finalize version in `main` - don't change the package.json version
2. Create a release branch with a name matching `release-vx.x.x` and push to github.
3. Update the changelog with the changes
4. Run `npx np --any-branch` against this branch - this will update the package.json version
5. Make sure the version update was pushed to github 
6. Merge to `main`
7. Update the github releases with the changes

[1]: https://w3c.github.io/aria-practices/
[2]: https://citizensadvice.github.io/react-list-boxes
[3]: https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_general_within
[4]: docs/test_helper.md
[5]: docs/accessibility.md
