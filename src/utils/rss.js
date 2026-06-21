const DOC_RSS_URL = 'https://www.doctorofcredit.com/category/credit-cards/shopping-deals/feed/';

const BANK_PATTERNS = [
  { pattern: /\bchase\b/i, bank: 'Chase' },
  { pattern: /\bamex\b|\bamerican express\b/i, bank: 'Amex' },
  { pattern: /\bdiscover\b/i, bank: 'Discover' },
  { pattern: /\bciti\b/i, bank: 'Citi' },
  { pattern: /\bcapital one\b/i, bank: 'Capital One' },
  { pattern: /\bbank of america\b|\bbofa\b/i, bank: 'BofA' },
];

const CATEGORY_PATTERNS = [
  { pattern: /\bdining\b|\brestaurant\b|\bfood\b/i, category: 'Dining' },
  { pattern: /\bgrocery\b|\bgroceries\b/i, category: 'Grocery' },
  { pattern: /\bgas\b|\bfuel\b/i, category: 'Gas' },
  { pattern: /\btravel\b|\bhotel\b|\bflight\b|\bairline\b/i, category: 'Travel' },
  { pattern: /\bstreaming\b|\bsubscription\b/i, category: 'Streaming' },
  { pattern: /\binsurance\b|\bgeico\b|\bprogressive\b/i, category: 'Insurance' },
  { pattern: /\bshopping\b|\bonline\b/i, category: 'Shopping' },
];

function detectBank(text) {
  for (const { pattern, bank } of BANK_PATTERNS) {
    if (pattern.test(text)) return bank;
  }
  return 'Unknown';
}

function detectCategory(text) {
  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(text)) return category;
  }
  return 'Other';
}

const BANK_NAMES_SET = new Set(['chase', 'amex', 'american express', 'discover', 'citi', 'capital one', 'bank of america', 'bofa']);

function extractDealInfo(title, description) {
  const combined = `${title} ${description}`;

  const parts = title.split(/\s*[:\-–—]\s*/);
  let merchant = title.slice(0, 40);
  if (parts.length >= 2) {
    const prefix = parts[0].replace(/\b(offer|deal|promo)\b/gi, '').trim();
    if (BANK_NAMES_SET.has(prefix.toLowerCase())) {
      merchant = parts[1].replace(/\b(offer|deal|promo)\b/gi, '').trim().split(/\s{2,}/)[0];
    } else {
      merchant = prefix;
    }
  }

  const dealMatch = combined.match(
    /(\d+%\s*(?:off|back|cash\s*back|bonus|savings|rebate|discount)(?:\s*\([^)]*\))?|\$\d+\s*(?:off|back|credit|bonus|statement credit)(?:\s*(?:on|when|for)\s*[^,.]*)?|(?:buy|spend)\s*\$?\d+[^,.]*(?:get|receive)\s*\$?\d+[^,.]*)/i
  );
  const deal = dealMatch ? dealMatch[0].trim() : title;

  return { merchant, deal };
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

export function parseRssXml(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemXml = match[1];

    const title = (itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
      itemXml.match(/<title>(.*?)<\/title>/))?.[1] || '';

    const description = stripHtml(
      (itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
        itemXml.match(/<description>([\s\S]*?)<\/description>/))?.[1] || ''
    );

    const link = (itemXml.match(/<link>(.*?)<\/link>/))?.[1] || '';

    const pubDate = (itemXml.match(/<pubDate>(.*?)<\/pubDate>/))?.[1] || '';

    const combined = `${title} ${description}`;
    const bank = detectBank(combined);
    const category = detectCategory(combined);
    const { merchant, deal } = extractDealInfo(title, description);

    items.push({
      title: title.trim(),
      merchant,
      bank,
      deal,
      category,
      link: link.trim(),
      pubDate: pubDate.trim(),
      isRelevant: bank === 'Chase' || bank === 'Discover',
    });
  }

  return items;
}

export async function fetchDeals() {
  try {
    const response = await fetch(DOC_RSS_URL);
    if (!response.ok) throw new Error(`RSS fetch failed: ${response.status}`);
    const xml = await response.text();
    return parseRssXml(xml);
  } catch (error) {
    console.error('Failed to fetch deals:', error);
    return [];
  }
}

export function filterRelevantDeals(deals) {
  return deals.filter((d) => d.isRelevant);
}
