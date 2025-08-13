
md.compilers.commonmark = (() => {
  const defaults = {
    safe: false,
    smart: false,
  };

  const description = {
    safe: 'Raw HTML will not be rendered',
    smart: [
      'Straight quotes will be made curly',
      '-- will be changed to an en dash',
      '--- will be changed to an em dash',
      'and ... will be changed to ellipses'
    ].join('\n'),
  };

  const ctor = ({ storage: { state } }) => ({
    defaults,
    description,
    compile: (markdown) => {
      const reader = new commonmark.Parser();
      const writer = new commonmark.HtmlRenderer(state.commonmark);
      return writer.render(reader.parse(markdown));
    }
  });

  return Object.assign(ctor, { defaults, description });
})();
