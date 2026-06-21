# SmartWallet Pointers — Test Guide

## Running Tests

```bash
npm test
```

Uses Vitest. All tests are co-located with source files (`*.test.js`).

## Test Files

### `src/utils/matcher.test.js` (14 tests)
- `getCurrentQuarter()` — returns valid YYYY-QN format
- `getBestCards()` — returns sorted card recommendations by effective value
  - Handles null category (returns empty)
  - CSP gets 3x on dining
  - Flex gets 3x on dining (fixed), 5x on Amazon in 2026-Q2 (rotating)
  - Discover gets 5% on dining in 2026-Q2 (rotating)
  - CSP leads for streaming (3x)
  - Falls back to "other" rate for unknown categories
  - Falls back to base rate when rotating limit is maxed (spend-aware)
  - Still uses rotating rate when under limit
  - Backward compatible with no spends parameter
- `getRotatingInfo()` — returns rotating card info for a given quarter

### `src/data/merchants.test.js` (13 tests)
- `getCategoryFromUrl()` — maps URLs to spending categories
  - Dining, Streaming, Amazon, Travel, Drugstore, Home Improvement
  - Handles null, undefined, invalid URLs
  - Returns null for unknown domains
- `getMerchantName()` — extracts merchant name from URL hostname

### `src/utils/rss.test.js` (10 tests)
- `parseRssXml()` — parses RSS XML into structured deal objects
  - Detects bank names (Chase, Amex, Discover)
  - Extracts merchant name from DoC title patterns
  - Extracts deal description with amounts/percentages
  - Preserves links and publication dates
  - Marks Chase/Discover deals as relevant
  - Handles empty XML
- `filterRelevantDeals()` — filters to Chase/Discover only

### `src/utils/storage.test.js` (7 tests)
- `getSpend/setSpend` — stores and retrieves card spend amounts
  - Returns 0 for unset spend, clamps negatives to 0
- `addSpend` — increments existing spend
- `getAllSpends` — returns all spends for a quarter (filters by quarter key)
- `getCachedDeals/setCachedDeals` — stores and retrieves RSS deal cache

## Manual Testing

1. Load the `dist/` folder as an unpacked extension in Chrome
2. Navigate to a supported merchant site (e.g., amazon.com, netflix.com)
3. Open the side panel — verify Smart Match shows correct card ranking
4. Check Smart Match shows "Limit reached" when a card's spend is maxed
5. Go to 5% Calendar tab — click "Edit spend" and enter an amount
6. Verify progress bar updates and color changes at 80%/100% thresholds
7. Go to Hot Deals tab — verify deals load and "Refresh" button works
8. Navigate to a merchant with a matching deal — verify it's highlighted
9. Toggle "My Cards" / "All Banks" filter
