const merchantMap = {
  // Dining
  'doordash.com': 'dining',
  'ubereats.com': 'dining',
  'grubhub.com': 'dining',
  'postmates.com': 'dining',
  'seamless.com': 'dining',
  'yelp.com': 'dining',
  'opentable.com': 'dining',
  'chipotle.com': 'dining',
  'mcdonalds.com': 'dining',
  'starbucks.com': 'dining',
  'chick-fil-a.com': 'dining',
  'dominos.com': 'dining',
  'pizzahut.com': 'dining',
  'subway.com': 'dining',
  'wendys.com': 'dining',
  'tacobell.com': 'dining',
  'panerabread.com': 'dining',
  'sweetgreen.com': 'dining',
  'toast.com': 'dining',

  // Streaming
  'netflix.com': 'streaming',
  'hulu.com': 'streaming',
  'disneyplus.com': 'streaming',
  'max.com': 'streaming',
  'peacocktv.com': 'streaming',
  'paramountplus.com': 'streaming',
  'crunchyroll.com': 'streaming',
  'spotify.com': 'streaming',
  'music.apple.com': 'streaming',
  'music.youtube.com': 'streaming',
  'tv.youtube.com': 'streaming',
  'primevideo.com': 'streaming',

  // Amazon
  'amazon.com': 'amazon',
  'amazon.co.uk': 'amazon',

  // Grocery
  'instacart.com': 'grocery',
  'freshdirect.com': 'grocery',
  'shipt.com': 'grocery',
  'walmart.com/grocery': 'grocery',
  'wholefoodsmarket.com': 'grocery',
  'kroger.com': 'grocery',
  'safeway.com': 'grocery',
  'albertsons.com': 'grocery',
  'publix.com': 'grocery',
  'traderjoes.com': 'grocery',
  'wegmans.com': 'grocery',

  // Online Grocery
  'thrivemarket.com': 'onlineGrocery',

  // Travel
  'chase.com/travel': 'travel',
  'expedia.com': 'generalTravel',
  'booking.com': 'generalTravel',
  'hotels.com': 'generalTravel',
  'airbnb.com': 'generalTravel',
  'vrbo.com': 'generalTravel',
  'kayak.com': 'generalTravel',
  'united.com': 'generalTravel',
  'delta.com': 'generalTravel',
  'aa.com': 'generalTravel',
  'southwest.com': 'generalTravel',
  'jetblue.com': 'generalTravel',
  'amtrak.com': 'generalTravel',
  'lyft.com': 'generalTravel',
  'uber.com': 'generalTravel',
  'hertz.com': 'generalTravel',
  'enterprise.com': 'generalTravel',
  'marriott.com': 'generalTravel',
  'hilton.com': 'generalTravel',
  'hyatt.com': 'generalTravel',
  'ihg.com': 'generalTravel',

  // Drugstores
  'walgreens.com': 'drugstore',
  'cvs.com': 'drugstore',
  'riteaid.com': 'drugstore',

  // Walmart
  'walmart.com': 'walmart',

  // PayPal
  'paypal.com': 'paypal',

  // Target
  'target.com': 'target',

  // Home Improvement
  'homedepot.com': 'homeImprovement',
  'lowes.com': 'homeImprovement',
  'menards.com': 'homeImprovement',
  'acehardware.com': 'homeImprovement',

  // Fitness
  'peloton.com': 'fitness',
  'classpass.com': 'fitness',

  // Shopping (general)
  'nike.com': 'shopping',
  'adidas.com': 'shopping',
  'bestbuy.com': 'shopping',
  'apple.com': 'shopping',
  'nordstrom.com': 'shopping',
  'macys.com': 'shopping',
  'costco.com': 'shopping',
  'ebay.com': 'shopping',
  'etsy.com': 'shopping',
  'wayfair.com': 'shopping',
  'ikea.com': 'shopping',
  'zara.com': 'shopping',
  'hm.com': 'shopping',
  'uniqlo.com': 'shopping',

  // Insurance
  'geico.com': 'insurance',
  'progressive.com': 'insurance',
  'statefarm.com': 'insurance',
  'allstate.com': 'insurance',
};

export function getCategoryFromUrl(url) {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    const pathUrl = hostname + new URL(url).pathname;

    for (const [pattern, category] of Object.entries(merchantMap)) {
      if (pattern.includes('/')) {
        if (pathUrl.startsWith(pattern)) return category;
      }
    }

    return merchantMap[hostname] || null;
  } catch {
    return null;
  }
}

export function getMerchantName(url) {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    const parts = hostname.split('.');
    return parts.length >= 2 ? parts[parts.length - 2] : hostname;
  } catch {
    return null;
  }
}
