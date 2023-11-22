const emoji = require('node-emoji');
const { marked } = require('marked');
const { markedHighlight } = require('marked-highlight');
const Prism = require('prismjs');
const path = require('path');
const { name, version } = require('./package.json');

const renderer = new marked.Renderer();
const originalLink = renderer.link;

renderer.link = function link(href, title, text) {
  if (/^(?!\/\/|\w+:)/.test(href)) {
    const parts = path.parse(href);
    const url = new URL(href, 'http://invalid/');
    href = path.join(parts.dir, `${parts.name}.pug${url.hash}`);
  }
  return originalLink.call(this, href, title, text);
};

marked.use(
  markedHighlight({
    highlight(code, lang) {
      return Prism.highlight(code, Prism.languages[lang], lang);
    },
  }),
);

marked.use({
  mangle: false,
  headerIds: false,
});

module.exports = {
  rootDir: 'examples/',
  filters: {
    highlight: (code) =>
      Prism.highlight(code, Prism.languages.javascript, 'javascript'),
    packageInclude: (text) =>
      text.replace(/from '(..\/)+src';$/gm, `from '${name}';`),
    markdown: (text) =>
      marked(
        text.replace(/:([\w\d_-]+):/g, (m, code) => emoji.get(code) || m),
        { renderer },
      ),
  },
  locals: {
    version,
  },
};
