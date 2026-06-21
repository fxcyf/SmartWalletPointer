import { describe, it, expect } from 'vitest';
import { getCategoryFromUrl, getMerchantName } from './merchants.js';

describe('getCategoryFromUrl', () => {
  it('returns null for null/undefined', () => {
    expect(getCategoryFromUrl(null)).toBeNull();
    expect(getCategoryFromUrl(undefined)).toBeNull();
  });

  it('detects dining from doordash', () => {
    expect(getCategoryFromUrl('https://www.doordash.com/store/123')).toBe('dining');
  });

  it('detects streaming from netflix', () => {
    expect(getCategoryFromUrl('https://netflix.com/browse')).toBe('streaming');
  });

  it('detects amazon', () => {
    expect(getCategoryFromUrl('https://www.amazon.com/dp/B0001')).toBe('amazon');
  });

  it('detects travel from chase travel portal', () => {
    expect(getCategoryFromUrl('https://www.chase.com/travel/booking')).toBe('travel');
  });

  it('detects general travel from airlines', () => {
    expect(getCategoryFromUrl('https://www.united.com/flights')).toBe('generalTravel');
  });

  it('detects drugstore from walgreens', () => {
    expect(getCategoryFromUrl('https://www.walgreens.com/pharmacy')).toBe('drugstore');
  });

  it('detects home improvement from homedepot', () => {
    expect(getCategoryFromUrl('https://www.homedepot.com/p/123')).toBe('homeImprovement');
  });

  it('returns null for unknown domains', () => {
    expect(getCategoryFromUrl('https://example.com')).toBeNull();
  });

  it('returns null for invalid URLs', () => {
    expect(getCategoryFromUrl('not-a-url')).toBeNull();
  });
});

describe('getMerchantName', () => {
  it('extracts merchant name from URL', () => {
    expect(getMerchantName('https://www.amazon.com/dp/123')).toBe('amazon');
  });

  it('handles subdomains', () => {
    expect(getMerchantName('https://www.doordash.com')).toBe('doordash');
  });

  it('returns null for null input', () => {
    expect(getMerchantName(null)).toBeNull();
  });
});
