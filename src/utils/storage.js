import { getExtensionApi } from './browser.js';

const SPEND_KEY_PREFIX = 'spend_';
const DEALS_KEY = 'cached_deals';
const DEALS_TIMESTAMP_KEY = 'deals_fetched_at';

function getStorage() {
  return getExtensionApi()?.storage?.local || null;
}

function spendKey(cardId, quarter) {
  return `${SPEND_KEY_PREFIX}${cardId}_${quarter}`;
}

export async function getSpend(cardId, quarter) {
  const storage = getStorage();
  if (!storage) return 0;
  const key = spendKey(cardId, quarter);
  const result = await storage.get(key);
  return result[key] || 0;
}

export async function setSpend(cardId, quarter, amount) {
  const storage = getStorage();
  if (!storage) return;
  const key = spendKey(cardId, quarter);
  await storage.set({ [key]: Math.max(0, amount) });
}

export async function addSpend(cardId, quarter, amount) {
  const current = await getSpend(cardId, quarter);
  await setSpend(cardId, quarter, current + amount);
  return current + amount;
}

export async function getAllSpends(quarter) {
  const storage = getStorage();
  if (!storage) return {};
  const result = await storage.get(null);
  const prefix = `${SPEND_KEY_PREFIX}`;
  const suffix = `_${quarter}`;
  const spends = {};
  for (const [key, value] of Object.entries(result)) {
    if (key.startsWith(prefix) && key.endsWith(suffix)) {
      const cardId = key.slice(prefix.length, -suffix.length);
      spends[cardId] = value;
    }
  }
  return spends;
}

export async function getCachedDeals() {
  const storage = getStorage();
  if (!storage) return [];
  const result = await storage.get([DEALS_KEY, DEALS_TIMESTAMP_KEY]);
  return {
    deals: result[DEALS_KEY] || [],
    fetchedAt: result[DEALS_TIMESTAMP_KEY] || null,
  };
}

export async function setCachedDeals(deals) {
  const storage = getStorage();
  if (!storage) return;
  await storage.set({
    [DEALS_KEY]: deals,
    [DEALS_TIMESTAMP_KEY]: Date.now(),
  });
}
