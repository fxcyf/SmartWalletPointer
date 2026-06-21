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

const DOC_RSS_URL = 'https://www.doctorofcredit.com/category/credit-cards/shopping-deals/feed/';
const ALARM_NAME = 'fetch-deals';
const FETCH_INTERVAL_MINUTES = 60;

const BANK_PATTERNS = [
  { pattern: /\bchase\b/i, bank: 'Chase' },
  { pattern: /\bamex\b|\bamerican express\b/i, bank: 'Amex' },
  { pattern: /\bdiscover\b/i, bank: 'Discover' },
  { pattern: /\bciti\b/i, bank: 'Citi' },
  { pattern: /\bcapital one\b/i, bank: 'Capital One' },
  { pattern: /\bbank of america\b|\bbofa\b/i, bank: 'BofA' },
];

const CATEGORY_PATTERNS = [
  { pattern: /\bdining\b|\brestaurant\b|\bfood\b/i, category: 'Dining' },
  { pattern: /\bgrocery\b/i, category: 'Grocery' },
  { pattern: /\bgas\b|\bfuel\b/i, category: 'Gas' },
  { pattern: /\btravel\b|\bhotel\b|\bflight\b/i, category: 'Travel' },
  { pattern: /\binsurance\b|\bgeico\b|\bprogressive\b/i, category: 'Insurance' },
  { pattern: /\bshopping\b/i, category: 'Shopping' },
];

function detect(text, patterns, field, fallback) {
  for (const p of patterns) {
    if (p.pattern.test(text)) return p[field];
  }
  return fallback;
}

function parseRss(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const x = m[1];
    const title = (x.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || x.match(/<title>(.*?)<\/title>/))?.[1] || '';
    const desc = (x.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || x.match(/<description>([\s\S]*?)<\/description>/))?.[1] || '';
    const link = (x.match(/<link>(.*?)<\/link>/))?.[1] || '';
    const pubDate = (x.match(/<pubDate>(.*?)<\/pubDate>/))?.[1] || '';
    const plain = desc.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
    const combined = `${title} ${plain}`;
    const merchantMatch = title.match(/^([^:–—\-]+?)[\s]*[:\-–—]/);
    const merchant = merchantMatch ? merchantMatch[1].trim() : title.slice(0, 40);
    const dealMatch = combined.match(/(\d+%\s*(?:off|back|cash\s*back|bonus)(?:\s*\([^)]*\))?|\$\d+\s*(?:off|back|credit|bonus)[^,.]*)/i);
    items.push({
      title: title.trim(),
      merchant,
      bank: detect(combined, BANK_PATTERNS, 'bank', 'Unknown'),
      deal: dealMatch ? dealMatch[0].trim() : title,
      category: detect(combined, CATEGORY_PATTERNS, 'category', 'Other'),
      link: link.trim(),
      pubDate: pubDate.trim(),
      isRelevant: detect(combined, BANK_PATTERNS, 'bank', 'Unknown') === 'Chase' || detect(combined, BANK_PATTERNS, 'bank', 'Unknown') === 'Discover',
    });
  }
  return items;
}

async function fetchAndCacheDeals() {
  try {
    const resp = await fetch(DOC_RSS_URL);
    if (!resp.ok) return;
    const xml = await resp.text();
    const deals = parseRss(xml);
    await chrome.storage.local.set({
      cached_deals: deals,
      deals_fetched_at: Date.now(),
    });
    chrome.runtime.sendMessage({ type: 'DEALS_UPDATED', deals }).catch(() => {});
  } catch (err) {
    console.error('Deal fetch failed:', err);
  }
}

chrome.alarms.create(ALARM_NAME, {
  delayInMinutes: 1,
  periodInMinutes: FETCH_INTERVAL_MINUTES,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) fetchAndCacheDeals();
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'REFRESH_DEALS') fetchAndCacheDeals();
});

chrome.runtime.onInstalled.addListener(() => {
  fetchAndCacheDeals();
});
