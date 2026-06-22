import { describe, it, expect, beforeEach } from 'vitest';
import { getSpend, setSpend, addSpend, getAllSpends, getCachedDeals, setCachedDeals } from './webStorage.js';

function mockLocalStorage() {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, val) => { store[key] = String(val); },
    key: (i) => Object.keys(store)[i],
    get length() { return Object.keys(store).length; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
}

describe('webStorage', () => {
  beforeEach(() => {
    mockLocalStorage();
    localStorage.clear();
  });

  it('returns 0 for unset spend', async () => {
    expect(await getSpend('cff', '2026-Q2')).toBe(0);
  });

  it('stores and retrieves spend', async () => {
    await setSpend('cff', '2026-Q2', 450);
    expect(await getSpend('cff', '2026-Q2')).toBe(450);
  });

  it('clamps negative spend to 0', async () => {
    await setSpend('cff', '2026-Q2', -100);
    expect(await getSpend('cff', '2026-Q2')).toBe(0);
  });

  it('adds to existing spend', async () => {
    await setSpend('discover', '2026-Q2', 200);
    const result = await addSpend('discover', '2026-Q2', 150);
    expect(result).toBe(350);
  });

  it('returns all spends for a quarter', async () => {
    await setSpend('cff', '2026-Q2', 300);
    await setSpend('discover', '2026-Q2', 100);
    await setSpend('cff', '2026-Q1', 999);
    const result = await getAllSpends('2026-Q2');
    expect(result).toEqual({ cff: 300, discover: 100 });
  });

  it('handles cached deals round-trip', async () => {
    const deals = [{ merchant: 'Test', bank: 'Chase', deal: '10%' }];
    await setCachedDeals(deals);
    const { deals: loaded, fetchedAt } = await getCachedDeals();
    expect(loaded).toEqual(deals);
    expect(fetchedAt).toBeGreaterThan(0);
  });

  it('returns empty deals when none cached', async () => {
    const { deals, fetchedAt } = await getCachedDeals();
    expect(deals).toEqual([]);
    expect(fetchedAt).toBeNull();
  });
});
