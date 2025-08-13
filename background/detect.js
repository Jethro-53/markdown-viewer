
md.detect = ({ storage: { state }, inject }) => {
  let onwakeup = true;

  const ff = (id, info, done) => {
    if (chrome.runtime.getBrowserInfo === undefined) {
      // chrome
      done('load');
    } else {
      const manifest = chrome.runtime.getManifest();
      if (manifest.browser_specific_settings && manifest.browser_specific_settings.gecko) {
        if (!info.url) {
          done('noop');
        } else {
          chrome.tabs.sendMessage(id, { message: 'ping' })
            .then(() => done('noop'))
            .catch(() => done('load'));
        }
      } else {
        done('load');
      }
    }
  };

  const tab = (id, info, tab) => {
    if (info.status === 'loading') {
      ff(id, info, (action) => {
        if (action === 'noop') return;
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: () => JSON.stringify({
            url: window.location.href,
            header: document.contentType,
            loaded: !!window.state,
          })
        }, (res) => {
          if (chrome.runtime.lastError) return;
          let win;
          try {
            win = JSON.parse(res[0].result);
            if (!win) return;
          } catch (err) {
            return;
          }
          if (win.loaded) return;
          if (detect(win.header, win.url)) {
            if (onwakeup && chrome.webRequest) {
              onwakeup = false;
              chrome.tabs.reload(id);
            } else {
              inject(id);
            }
          }
        });
      });
    }
  };

  const detect = (content, url) => {
    const location = new URL(url);
    const origin =
      state.origins[location.origin] ||
      state.origins[location.protocol + '//' + location.hostname] ||
      state.origins[location.protocol + '//' + location.host] ||
      state.origins[location.protocol + '//*.' + location.hostname.replace(/^[^.]+\.(.*)/, '$1')] ||
      state.origins[location.protocol + '//*.' + location.host.replace(/^[^.]+\.(.*)/, '$1')] ||
      state.origins['*://' + location.hostname] ||
      state.origins['*://' + location.host] ||
      state.origins['*://*.' + location.hostname.replace(/^[^.]+\.(.*)/, '$1')] ||
      state.origins['*://*.' + location.host.replace(/^[^.]+\.(.*)/, '$1')] ||
      state.origins['*://*'];

    return (
      (origin && origin.header && origin.path && origin.match && /\btext\/(?:(?:(?:x-)?markdown)|plain)\b/i.test(content) && new RegExp(origin.match).test(location.href)) ||
      (origin && origin.header && !origin.path && /\btext\/(?:(?:(?:x-)?markdown)|plain)\b/i.test(content)) ||
      (origin && origin.path && origin.match && !origin.header && new RegExp(origin.match).test(location.href))
        ? origin
        : undefined
    );
  };

  return { tab };
};
