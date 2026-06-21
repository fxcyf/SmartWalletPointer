import React from 'react';

const PLACEHOLDER_DEALS = [
  { bank: 'Chase', merchant: 'Geico', deal: '10% back (max $20)', category: 'Insurance' },
  { bank: 'Chase', merchant: 'Starbucks', deal: '10% cash back', category: 'Dining' },
  { bank: 'Chase', merchant: 'Instacart', deal: '$10 off $50+', category: 'Grocery' },
  { bank: 'Chase', merchant: 'DoorDash', deal: '10% back (max $15)', category: 'Dining' },
  { bank: 'Discover', merchant: 'Target', deal: '5% cash back via Discover Deals', category: 'Shopping' },
];

export default function HotDeals() {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-bold text-gray-700">Hot Deals</h2>
        <span className="text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
          Phase 2: Live RSS
        </span>
      </div>

      <p className="text-[11px] text-gray-400 mb-2">
        Sample data below. Phase 2 will pull live deals from Doctor of Credit RSS.
      </p>

      {PLACEHOLDER_DEALS.map((deal, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
        >
          <span
            className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-md text-white ${
              deal.bank === 'Chase' ? 'bg-chase' : 'bg-discover'
            }`}
          >
            {deal.bank}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800">{deal.merchant}</p>
            <p className="text-xs text-gray-500">{deal.deal}</p>
            <span className="text-[10px] text-gray-400 mt-0.5 inline-block">{deal.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
