
md.xhr = () => {
  const get = (url, done) => {
    (async () => {
      await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(url + '?preventCache=' + Date.now());
          done(null, await res.text());
        } catch (err) {
          done(err);
        }
      });
    })();
  };
  return { get };
};
