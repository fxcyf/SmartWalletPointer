# SmartWallet Pointers — Test Guide

## Running Tests

```bash
npm test
```

Uses Vitest. All tests are co-located with source files (`*.test.js`).

## Test Files

### `src/utils/matcher.test.js`
- `getCurrentQuarter()` — returns valid YYYY-QN format
- `getBestCards()` — returns sorted card recommendations by effective value
  - Handles null category (returns empty)
  - CSP gets 3x on dining
  - Flex gets 3x on dining (fixed), 5x on Amazon in 2026-Q2 (rotating)
  - Discover gets 5% on dining in 2026-Q2 (rotating)
  - CSP leads for streaming (3x)
  - Falls back to "other" rate for unknown categories
- `getRotatingInfo()` — returns rotating card info for a given quarter

### `src/data/merchants.test.js`
- `getCategoryFromUrl()` — maps URLs to spending categories
  - Dining: doordash.com
  - Streaming: netflix.com
  - Amazon: amazon.com
  - Travel: chase.com/travel, united.com
  - Drugstore: walgreens.com
  - Home Improvement: homedepot.com
  - Handles null, undefined, invalid URLs
  - Returns null for unknown domains
- `getMerchantName()` — extracts merchant name from URL hostname

## Manual Testing

1. Load the `dist/` folder as an unpacked extension in Chrome
2. Navigate to a supported merchant site (e.g., amazon.com, netflix.com)
3. Open the side panel — verify the Smart Match tab shows correct card ranking
4. Check the 5% Calendar tab shows current quarter's rotating categories
5. Verify the Hot Deals tab renders placeholder deals
