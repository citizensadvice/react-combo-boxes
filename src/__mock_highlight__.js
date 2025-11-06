import { diff } from 'jest-diff';

window.Highlight = Set;

beforeEach(() => {
  CSS.highlights = new Map();
});

expect.extend({
  toHaveHighlights(actual, ...expected) {
    const highlight = [...(actual || [])].map((r) => [
      r.commonAncestorContainer.data?.slice(r.startOffset, r.endOffset),
      r.startOffset,
      r.endOffset,
    ]);

    const pass = this.equals(highlight, expected);
    if (pass) {
      return {
        pass: true,
      };
    }
    return {
      pass: false,
      message: () => diff(expected, highlight, { expand: this.expand }),
    };
  },
});
