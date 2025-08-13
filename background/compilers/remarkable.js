
md.compilers.remarkable = (() => {
  const defaults = {
    breaks: false,
    html: true,
    linkify: true,
    typographer: false,
    xhtmlOut: false,
    langPrefix: 'language-',
    quotes: '“”‘’'
  };

  const description = {
    breaks: 'Convert \\n in paragraphs into <br>',
    html: 'Enable HTML tags in source',
    linkify: 'Autoconvert URL-like text to links',
    typographer: 'Enable some language-neutral replacement + quotes beautification',
    xhtmlOut: 'Use / to close single tags (<br />)'
  };

  const ctor = ({ storage: { state } }) => ({
    defaults,
    description,
    compile: (markdown) =>
      new Remarkable('full', state.remarkable)
        .render(markdown)
  });

  return Object.assign(ctor, { defaults, description });
})();
