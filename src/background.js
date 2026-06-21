chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === 'complete') {
    chrome.runtime
      .sendMessage({ type: 'TAB_UPDATED', url: tab.url, tabId })
      .catch(() => {});
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    chrome.runtime
      .sendMessage({ type: 'TAB_UPDATED', url: tab.url, tabId })
      .catch(() => {});
  } catch {}
});
