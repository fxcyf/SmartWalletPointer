# SmartWallet Pointers

A lightweight Chrome extension (Manifest V3) that recommends the best credit card to use based on the merchant you're browsing.

## Supported Cards

- **Chase Sapphire Preferred (CSP)** — 3x Dining, 3x Streaming, 5x Chase Travel, 2x Other Travel
- **Chase Freedom Flex** — 3x Dining, 3x Drugstores, 5x Chase Travel + quarterly 5% rotating categories
- **Discover it Cash Back** — 1% everything + quarterly 5% rotating categories

## Features

### Tab 1: Smart Match
Automatically detects the merchant website you're visiting, maps it to a spending category, and ranks all three cards by effective return value. When a rotating category limit is maxed out, the card falls back to its base rate. Shows active merchant-specific offers from the deals feed.

### Tab 2: 5% Calendar
Shows the current quarter's rotating 5% categories for Flex and Discover with:
- Live spending progress bars (color-coded: blue → amber at 80% → red at 100%)
- Manual spend tracking via "Edit spend" button (persisted in chrome.storage.local)
- Remaining limit display

### Tab 3: Hot Deals
Aggregates credit card deals from Doctor of Credit RSS feed:
- Auto-fetches every 60 minutes via chrome.alarms
- Filters by "My Cards" (Chase/Discover) or "All Banks"
- Highlights deals matching the current merchant site
- Manual refresh button with last-fetched timestamp
- Falls back to sample data when no RSS available

## Installation (Developer Mode)

### Chrome
1. Clone the repo and install dependencies:
   ```bash
   npm install
   npm run build        # or: npm run build:chrome
   ```
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked" → select the `dist/` folder
5. Click the extension icon to open the popup

### Firefox
1. Build for Firefox:
   ```bash
   npm install
   npm run build:firefox
   ```
2. Open Firefox → `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on..." → select `dist/manifest.json`
4. Click the extension icon to open the popup

## Development

```bash
npm run dev           # Watch mode (auto-rebuild, Chrome target)
npm run build         # Production build (Chrome)
npm run build:chrome  # Explicit Chrome build
npm run build:firefox # Firefox build
npm test              # Run unit tests
```

## Project Structure

```
manifest.json           # MV3 extension manifest
src/
  background.js         # Service worker: tab monitoring + RSS alarm
  data/
    cards.js            # Static card benefit definitions
    merchants.js        # Domain → category mapping
  sidepanel/
    index.html          # Side panel entry point
    main.jsx            # React mount
    App.jsx             # Main app with tab navigation
    components/
      SmartMatch.jsx    # Card recommendation UI + offer alerts
      Calendar.jsx      # 5% calendar with spend tracking
      HotDeals.jsx      # Live RSS deal feed
  utils/
    matcher.js          # Best-card engine (spend-limit aware)
    storage.js          # chrome.storage.local wrapper
    rss.js              # DoC RSS parser & deal extraction
    browser.js          # Cross-browser API compatibility
```

## Cross-Browser Support

- **Chrome:** `npm run build` (default) — uses `service_worker` for background
- **Firefox:** `npm run build:firefox` — uses `background.scripts` + gecko settings
- **Safari:** Build the Chrome version, then use Xcode's "Convert Chrome Extension" (Xcode 15+)

The `src/utils/browser.js` module auto-detects `browser` (Firefox) vs `chrome` (Chrome/Edge) APIs at runtime. All frontend code uses this abstraction.

## Roadmap

- [x] **Phase 1:** Static card data, domain matching, popup UI with 3 tabs
- [x] **Phase 2:** Spend tracking progress bars, live RSS deals from Doctor of Credit
- [x] **Phase 3:** Cross-browser support (Chrome + Firefox + Safari prep)
