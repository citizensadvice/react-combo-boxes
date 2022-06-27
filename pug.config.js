/* eslint-disable import/no-extraneous-dependencies */
const emoji = require('node-emoji');
const { marked } = require('marked');
const Prism = require('prismjs');
const path = require('path');
const { name } = require('./package.json');

const renderer = new marked.Renderer();
const originalLink = renderer.link;

renderer.link = function link(href, title, text) {
  if (/^(?!\/\/|\w+:)/.test(href)) {
    const parts = path.parse(href);
    const url = new URL(href, 'http://invalid/');
    href = path.join(parts.dir, `${parts.name}.pug${url.hash}`); // eslint-disable-line no-param-reassign
  }
  return originalLink.call(this, href, title, text);
};

module.exports = {
  rootDir: 'examples/',
  filters: {
    highlight: (code) => Prism.highlight(code, Prism.languages.javascript, 'javascript'),
    packageInclude: (text) => text.replace(/from '(..\/)+src';$/mg, `from '${name}';`),
    markdown: (text) => marked(
      text.replace(/:([\w\d_-]+):/g, (m, code) => emoji.get(code) || m),
      { highlight: (code, lang) => Prism.highlight(code, Prism.languages[lang], lang), renderer },
    ),
  },
};
