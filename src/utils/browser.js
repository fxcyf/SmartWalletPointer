const browser = (typeof globalThis.browser !== 'undefined' && globalThis.browser) || globalThis.chrome;

export default browser;

export function isChrome() {
  return typeof chrome !== 'undefined' && !!chrome.runtime?.id;
}

export function isSafari() {
  return typeof browser !== 'undefined'
    && typeof browser.runtime !== 'undefined'
    && /Safari/i.test(navigator.userAgent)
    && !/Chrome/i.test(navigator.userAgent);
}

export function getExtensionApi() {
  return browser;
}
