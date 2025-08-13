
importScripts('/vendor/markdown-it.min.js')
importScripts('/vendor/marked.min.js')
importScripts('/vendor/remark.min.js')
importScripts('/background/compilers/markdown-it.js')
importScripts('/background/compilers/marked.js')
importScripts('/background/compilers/remark.js')

importScripts('/background/storage.js')
importScripts('/background/webrequest.js')
importScripts('/background/detect.js')
importScripts('/background/inject.js')
importScripts('/background/messages.js')
importScripts('/background/mathjax.js')
importScripts('/background/xhr.js')
importScripts('/background/icon.js')

(() => {
  const storage = md.storage(md);
  const inject = md.inject({ storage });
  const detect = md.detect({ storage, inject });
  const webrequest = md.webrequest({ storage });
  const mathjax = md.mathjax();
  const xhr = md.xhr();
  const icon = md.icon({ storage });

  const compilers = Object.keys(md.compilers)
    .reduce((all, compiler) => {
      all[compiler] = md.compilers[compiler]({ storage });
      return all;
    }, {});

  const messages = md.messages({ storage, compilers, mathjax, xhr, webrequest, icon });

  chrome.tabs.onUpdated.addListener(detect.tab);
  chrome.runtime.onMessage.addListener(messages);

  icon();
})();
