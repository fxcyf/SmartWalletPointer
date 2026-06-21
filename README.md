# SmartWallet Pointers

A lightweight Chrome extension (Manifest V3) that recommends the best credit card to use based on the merchant you're browsing.

## Supported Cards

- **Chase Sapphire Preferred (CSP)** — 3x Dining, 3x Streaming, 5x Chase Travel, 2x Other Travel
- **Chase Freedom Flex** — 3x Dining, 3x Drugstores, 5x Chase Travel + quarterly 5% rotating categories
- **Discover it Cash Back** — 1% everything + quarterly 5% rotating categories

## Features

### Tab 1: Smart Match
Automatically detects the merchant website you're visiting, maps it to a spending category, and ranks all three cards by effective return value.

### Tab 2: 5% Calendar
Shows the current quarter's rotating 5% categories for Flex and Discover, with category tags and spending limit progress bars (Phase 2: manual spend tracking).

### Tab 3: Hot Deals
Placeholder for Phase 2 RSS integration with Doctor of Credit. Currently shows sample deals.

## Installation (Developer Mode)

1. Clone the repo and install dependencies:
   ```bash
   npm install
   npm run build
   ```
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked" → select the `dist/` folder
5. Click the extension icon to open the side panel

## Development

```bash
npm run dev     # Watch mode (auto-rebuild on changes)
npm run build   # Production build
npm test        # Run unit tests
```

## Project Structure

```
manifest.json           # MV3 extension manifest
src/
  background.js         # Service worker: tab monitoring
  data/
    cards.js            # Static card benefit definitions
    merchants.js        # Domain → category mapping
  sidepanel/
    index.html          # Side panel entry point
    main.jsx            # React mount
    App.jsx             # Main app with tab navigation
    components/
      SmartMatch.jsx    # Card recommendation UI
      Calendar.jsx      # Rotating 5% calendar UI
      HotDeals.jsx      # Deal feed UI (placeholder)
  utils/
    matcher.js          # Best-card calculation engine
```

## Roadmap

- **Phase 1 (Current):** Static card data, domain matching, sidepanel UI with 3 tabs
- **Phase 2:** Spend tracking progress bars, live RSS deals from Doctor of Credit
- **Phase 3:** Safari/iOS port via WebExtensions
