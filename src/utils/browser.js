export function getExtensionApi() {
  return (typeof globalThis.browser !== 'undefined' && globalThis.browser)
    || globalThis.chrome
    || null;
}

const api = getExtensionApi();
export default api;

export function isChrome() {
  return typeof chrome !== 'undefined' && !!chrome.runtime?.id;
}

export function isFirefox() {
  return typeof globalThis.browser !== 'undefined'
    && typeof globalThis.browser.runtime !== 'undefined';
}
