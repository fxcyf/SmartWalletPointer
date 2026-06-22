const SPEND_KEY_PREFIX = 'spend_';
const DEALS_KEY = 'cached_deals';
const DEALS_TIMESTAMP_KEY = 'deals_fetched_at';

function spendKey(cardId, quarter) {
  return `${SPEND_KEY_PREFIX}${cardId}_${quarter}`;
}

export async function getSpend(cardId, quarter) {
  const val = localStorage.getItem(spendKey(cardId, quarter));
  return val ? Number(val) : 0;
}

export async function setSpend(cardId, quarter, amount) {
  localStorage.setItem(spendKey(cardId, quarter), String(Math.max(0, amount)));
}

export async function addSpend(cardId, quarter, amount) {
  const current = await getSpend(cardId, quarter);
  const next = current + amount;
  await setSpend(cardId, quarter, next);
  return next;
}

export async function getAllSpends(quarter) {
  const spends = {};
  const suffix = `_${quarter}`;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(SPEND_KEY_PREFIX) && key.endsWith(suffix)) {
      const cardId = key.slice(SPEND_KEY_PREFIX.length, -suffix.length);
      spends[cardId] = Number(localStorage.getItem(key)) || 0;
    }
  }
  return spends;
}

export async function getCachedDeals() {
  try {
    const raw = localStorage.getItem(DEALS_KEY);
    const ts = localStorage.getItem(DEALS_TIMESTAMP_KEY);
    return {
      deals: raw ? JSON.parse(raw) : [],
      fetchedAt: ts ? Number(ts) : null,
    };
  } catch {
    return { deals: [], fetchedAt: null };
  }
}

export async function setCachedDeals(deals) {
  localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
  localStorage.setItem(DEALS_TIMESTAMP_KEY, String(Date.now()));
}
