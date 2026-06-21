import { describe, it, expect } from 'vitest';
import { parseRssXml, filterRelevantDeals } from './rss.js';

const SAMPLE_RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Doctor of Credit</title>
  <item>
    <title><![CDATA[Chase Offer: Starbucks 10% Back (Max $5)]]></title>
    <description><![CDATA[<p>Chase has a new offer for Starbucks giving 10% back up to $5.</p>]]></description>
    <link>https://www.doctorofcredit.com/chase-starbucks</link>
    <pubDate>Mon, 15 Jun 2026 10:00:00 +0000</pubDate>
  </item>
  <item>
    <title>Amex Offer: Home Depot Spend $100 Get $20 Back</title>
    <description>American Express has a targeted offer for Home Depot.</description>
    <link>https://www.doctorofcredit.com/amex-homedepot</link>
    <pubDate>Sun, 14 Jun 2026 09:00:00 +0000</pubDate>
  </item>
  <item>
    <title><![CDATA[Discover Deals: Target 5% Cash Back]]></title>
    <description><![CDATA[Discover has activated a 5% cash back deal at Target through Discover Deals.]]></description>
    <link>https://www.doctorofcredit.com/discover-target</link>
    <pubDate>Sat, 13 Jun 2026 08:00:00 +0000</pubDate>
  </item>
</channel>
</rss>`;

describe('parseRssXml', () => {
  it('parses items from RSS XML', () => {
    const items = parseRssXml(SAMPLE_RSS);
    expect(items).toHaveLength(3);
  });

  it('detects Chase bank correctly', () => {
    const items = parseRssXml(SAMPLE_RSS);
    expect(items[0].bank).toBe('Chase');
  });

  it('detects Amex bank correctly', () => {
    const items = parseRssXml(SAMPLE_RSS);
    expect(items[1].bank).toBe('Amex');
  });

  it('detects Discover bank correctly', () => {
    const items = parseRssXml(SAMPLE_RSS);
    expect(items[2].bank).toBe('Discover');
  });

  it('extracts merchant name from title', () => {
    const items = parseRssXml(SAMPLE_RSS);
    expect(items[0].merchant).toBeTruthy();
    expect(items[1].merchant).toContain('Home Depot');
  });

  it('extracts deal info', () => {
    const items = parseRssXml(SAMPLE_RSS);
    expect(items[0].deal).toMatch(/10%/);
  });

  it('extracts link', () => {
    const items = parseRssXml(SAMPLE_RSS);
    expect(items[0].link).toBe('https://www.doctorofcredit.com/chase-starbucks');
  });

  it('marks Chase and Discover as relevant', () => {
    const items = parseRssXml(SAMPLE_RSS);
    expect(items[0].isRelevant).toBe(true);
    expect(items[1].isRelevant).toBe(false);
    expect(items[2].isRelevant).toBe(true);
  });

  it('handles empty XML', () => {
    expect(parseRssXml('')).toEqual([]);
  });
});

describe('filterRelevantDeals', () => {
  it('keeps only Chase and Discover deals', () => {
    const items = parseRssXml(SAMPLE_RSS);
    const relevant = filterRelevantDeals(items);
    expect(relevant).toHaveLength(2);
    expect(relevant.every((d) => d.bank === 'Chase' || d.bank === 'Discover')).toBe(true);
  });
});
