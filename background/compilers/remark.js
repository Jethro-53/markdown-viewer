
md.compilers.remark = (() => {
  const defaults = {
    breaks: false,
    gfm: true,
    sanitize: false,
  };

  const description = {
    breaks: 'Exposes newline characters inside paragraphs as breaks',
    gfm: 'Toggle GFM (GitHub Flavored Markdown)',
    sanitize: 'Disable HTML tag rendering',
  };

  const ctor = ({ storage: { state } }) => ({
    defaults,
    description,
    compile: (markdown) =>
      remark.remark()
        .use(remark.parse)
        .use(state.remark.gfm ? remark.gfm : undefined)
        .use(state.remark.breaks ? remark.breaks : undefined)
        .use(remark.stringify)
        .use(remark.slug)
        .use(remark.html, state.remark) // sanitize
        .processSync(markdown)
        .value
  });

  return Object.assign(ctor, { defaults, description });
})();
