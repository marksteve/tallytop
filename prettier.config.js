module.exports = {
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 100,
  plugins: [require('prettier-plugin-svelte'), require('prettier-plugin-tailwindcss')],
  pluginSearchDirs: ['.'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
};
