
md.mathjax = () => {
  const delimiters = new RegExp([
    /\$\$[^`]*?\$\$/,
    /\\\([^`]*?\\\)/,
    /\\\[[^`]*?\\\]/,
    /\\begin\{.*?\}[^`]*?\\end\{.*?\}/,
    /\$[^`\n]*?\$/,
  ].map(regex => `(?:${regex.source})`).join('|'), 'gi');

  const escape = math =>
    math.replace(/[<>&]/gi, symbol =>
      symbol === '>' ? '&gt;'
      : symbol === '<' ? '&lt;'
      : symbol === '&' ? '&amp;'
      : null
    );

  const ctor = (map = {}) => ({
    tokenize: markdown =>
      markdown.replace(delimiters, (str, offset) => (
        map[offset] = str,
        `?${offset}?`
      )),
    detokenize: html =>
      Object.keys(map)
        .reduce((html, offset) =>
          html.replace(`?${offset}?`, () => escape(map[offset])),
          html
        )
  });

  return Object.assign(ctor, { delimiters, escape });
};
