const DEFAULT_SHARED_POOL_NAME = 'microApp';

window[DEFAULT_SHARED_POOL_NAME] = {};

export function mount(name, payload) {
  window[DEFAULT_SHARED_POOL_NAME][name] = payload;
}

export function remove() {
  const shared = window[DEFAULT_SHARED_POOL_NAME];
  Object.keys(shared).forEach((v) => {
    delete shared[v];
  });
  delete window[DEFAULT_SHARED_POOL_NAME];
}

export default function loadModule(url, noCache = false) {
  if (!url || typeof url !== 'string') {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    script.src = noCache ? addTimestamp(url) : url;
    document.body.appendChild(script);
  });
}

function addTimestamp(url) {
  return url.indexOf('?') > -1 ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;
}
