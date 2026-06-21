import React, { useState, useEffect } from 'react';
import { getBestCards } from '../../utils/matcher.js';
import { getAllSpends, getCachedDeals } from '../../utils/storage.js';

const RANK_STYLES = [
  { emoji: '\u{1F451}', bg: 'bg-amber-50', border: 'border-amber-300', label: 'Best Pick' },
  { emoji: '\u{1F948}', bg: 'bg-gray-50', border: 'border-gray-200', label: '2nd' },
  { emoji: '\u{1F949}', bg: 'bg-orange-50/50', border: 'border-orange-200', label: '3rd' },
];

export default function SmartMatch({ category, merchantName, quarter }) {
  const [spends, setSpends] = useState({});
  const [matchingOffers, setMatchingOffers] = useState([]);

  useEffect(() => {
    getAllSpends(quarter).then(setSpends);
  }, [quarter]);

  useEffect(() => {
    if (!merchantName) return;
    getCachedDeals().then(({ deals }) => {
      const matching = deals.filter(
        (d) =>
          (d.bank === 'Chase' || d.bank === 'Discover') &&
          d.merchant.toLowerCase().includes(merchantName.toLowerCase())
      );
      setMatchingOffers(matching);
    });
  }, [merchantName]);

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center text-gray-400">
        <div className="text-4xl mb-3">&#x1F6D2;</div>
        <p className="text-sm font-medium text-gray-500">Navigate to a merchant site</p>
        <p className="text-xs mt-1">
          We'll automatically detect the category and recommend the best card from your wallet.
        </p>
      </div>
    );
  }

  const ranked = getBestCards(category, quarter, spends);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Recommendations for
        </span>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-100 rounded-full px-2.5 py-0.5 capitalize">
          {category}
        </span>
      </div>

      {matchingOffers.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 mb-1">
          <p className="text-[11px] font-semibold text-amber-700 mb-1">
            &#x1F4A1; Active Offers for {merchantName}
          </p>
          {matchingOffers.map((offer, i) => (
            <p key={i} className="text-[11px] text-amber-600">
              [{offer.bank}] {offer.deal}
            </p>
          ))}
        </div>
      )}

      {ranked.map((card, i) => {
        const style = RANK_STYLES[i] || RANK_STYLES[2];
        return (
          <div
            key={card.cardId}
            className={`rounded-xl border-2 ${style.border} ${style.bg} p-4 transition-all ${
              i === 0 ? 'shadow-md' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{style.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-gray-800">{card.shortName}</p>
                  <p className="text-[11px] text-gray-500">{card.cardName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black" style={{ color: card.color }}>
                  {card.rate}{card.unit}
                </p>
                <p className="text-[10px] text-gray-400">
                  ~{card.effectiveValue.toFixed(1)}% value
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {card.isRotating && (
                <span className="inline-flex items-center bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  &#x1F525; Rotating 5%
                </span>
              )}
              {card.rotationMaxed && (
                <span className="inline-flex items-center bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Limit reached
                </span>
              )}
              <span className="text-[11px] text-gray-500">{card.reason}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
