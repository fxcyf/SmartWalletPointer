import { describe, it, expect } from 'vitest';
import { getBestCards, getCurrentQuarter, getRotatingInfo } from './matcher.js';

describe('getCurrentQuarter', () => {
  it('returns a string in YYYY-QN format', () => {
    const q = getCurrentQuarter();
    expect(q).toMatch(/^\d{4}-Q[1-4]$/);
  });
});

describe('getBestCards', () => {
  it('returns empty array for null category', () => {
    expect(getBestCards(null, '2026-Q2')).toEqual([]);
  });

  it('returns all 3 cards sorted by effective value for dining', () => {
    const result = getBestCards('dining', '2026-Q2');
    expect(result).toHaveLength(3);
    expect(result[0].effectiveValue).toBeGreaterThanOrEqual(result[1].effectiveValue);
    expect(result[1].effectiveValue).toBeGreaterThanOrEqual(result[2].effectiveValue);
  });

  it('CSP gets 3x on dining', () => {
    const result = getBestCards('dining', '2026-Q2');
    const csp = result.find((c) => c.cardId === 'csp');
    expect(csp.rate).toBe(3);
    expect(csp.unit).toBe('x');
  });

  it('Flex gets 3x on dining (fixed benefit)', () => {
    const result = getBestCards('dining', '2026-Q2');
    const flex = result.find((c) => c.cardId === 'cff');
    expect(flex.rate).toBe(3);
  });

  it('Discover gets 5% on dining in 2026 Q2 (rotating)', () => {
    const result = getBestCards('dining', '2026-Q2');
    const disc = result.find((c) => c.cardId === 'discover');
    expect(disc.rate).toBe(5);
    expect(disc.isRotating).toBe(true);
  });

  it('Flex gets 5x on amazon in 2026 Q2 (rotating)', () => {
    const result = getBestCards('amazon', '2026-Q2');
    const flex = result.find((c) => c.cardId === 'cff');
    expect(flex.rate).toBe(5);
    expect(flex.isRotating).toBe(true);
  });

  it('CSP leads for streaming', () => {
    const result = getBestCards('streaming', '2026-Q2');
    expect(result[0].cardId).toBe('csp');
    expect(result[0].rate).toBe(3);
  });

  it('falls back to "other" rate for unknown categories', () => {
    const result = getBestCards('shopping', '2026-Q2');
    result.forEach((card) => {
      expect(card.rate).toBeGreaterThanOrEqual(1);
    });
  });

  it('falls back to base rate when rotating limit is maxed', () => {
    const spends = { discover: 1500 };
    const result = getBestCards('dining', '2026-Q2', spends);
    const disc = result.find((c) => c.cardId === 'discover');
    expect(disc.rate).toBe(1);
    expect(disc.isRotating).toBe(false);
    expect(disc.rotationMaxed).toBe(true);
  });

  it('still uses rotating rate when under limit', () => {
    const spends = { discover: 500 };
    const result = getBestCards('dining', '2026-Q2', spends);
    const disc = result.find((c) => c.cardId === 'discover');
    expect(disc.rate).toBe(5);
    expect(disc.isRotating).toBe(true);
    expect(disc.rotationMaxed).toBe(false);
  });

  it('works with no spends parameter (backward compatible)', () => {
    const result = getBestCards('amazon', '2026-Q2');
    const flex = result.find((c) => c.cardId === 'cff');
    expect(flex.rate).toBe(5);
  });
});

describe('getRotatingInfo', () => {
  it('returns rotating cards for 2026-Q2', () => {
    const info = getRotatingInfo('2026-Q2');
    expect(info.length).toBe(2);
    const ids = info.map((i) => i.cardId);
    expect(ids).toContain('cff');
    expect(ids).toContain('discover');
  });

  it('returns empty for a quarter with no rotations', () => {
    const info = getRotatingInfo('2099-Q1');
    expect(info).toEqual([]);
  });
});
