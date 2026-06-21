import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSpend, setSpend, addSpend, getAllSpends, getCachedDeals, setCachedDeals } from './storage.js';

const mockStore = {};

function mockChromeStorage() {
  globalThis.chrome = {
    storage: {
      local: {
        get: vi.fn(async (keys) => {
          if (keys === null) return { ...mockStore };
          if (typeof keys === 'string') return { [keys]: mockStore[keys] };
          const result = {};
          for (const k of keys) result[k] = mockStore[k];
          return result;
        }),
        set: vi.fn(async (items) => {
          Object.assign(mockStore, items);
        }),
      },
    },
  };
}

describe('storage', () => {
  beforeEach(() => {
    Object.keys(mockStore).forEach((k) => delete mockStore[k]);
    mockChromeStorage();
  });

  describe('getSpend / setSpend', () => {
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
  });

  describe('addSpend', () => {
    it('adds to existing spend', async () => {
      await setSpend('discover', '2026-Q2', 200);
      const result = await addSpend('discover', '2026-Q2', 150);
      expect(result).toBe(350);
      expect(await getSpend('discover', '2026-Q2')).toBe(350);
    });
  });

  describe('getAllSpends', () => {
    it('returns spends for a quarter', async () => {
      await setSpend('cff', '2026-Q2', 300);
      await setSpend('discover', '2026-Q2', 100);
      await setSpend('cff', '2026-Q1', 999);
      const result = await getAllSpends('2026-Q2');
      expect(result).toEqual({ cff: 300, discover: 100 });
    });
  });

  describe('getCachedDeals / setCachedDeals', () => {
    it('returns empty deals when none cached', async () => {
      const { deals, fetchedAt } = await getCachedDeals();
      expect(deals).toEqual([]);
      expect(fetchedAt).toBeNull();
    });

    it('stores and retrieves deals', async () => {
      const testDeals = [{ merchant: 'Test', bank: 'Chase', deal: '10%' }];
      await setCachedDeals(testDeals);
      const { deals, fetchedAt } = await getCachedDeals();
      expect(deals).toEqual(testDeals);
      expect(fetchedAt).toBeGreaterThan(0);
    });
  });
});
