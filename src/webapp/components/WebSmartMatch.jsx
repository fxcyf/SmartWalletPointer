import React, { useState, useEffect } from 'react';
import { getBestCards } from '../../utils/matcher.js';
import { getAllSpends, getCachedDeals } from '../../utils/webStorage.js';
import { cards } from '../../data/cards.js';

const RANK_STYLES = [
  { emoji: '\u{1F451}', bg: 'bg-amber-50', border: 'border-amber-300' },
  { emoji: '\u{1F948}', bg: 'bg-gray-50', border: 'border-gray-200' },
  { emoji: '\u{1F949}', bg: 'bg-orange-50/50', border: 'border-orange-200' },
];

const CATEGORY_NAMES = {
  dining: 'Dining', streaming: 'Streaming', onlineGrocery: 'Online Grocery',
  travel: 'Chase Travel', generalTravel: 'Other Travel', drugstore: 'Drugstores',
  grocery: 'Grocery', amazon: 'Amazon', fitness: 'Fitness', walmart: 'Walmart',
  paypal: 'PayPal', target: 'Target', homeImprovement: 'Home Improvement',
  restaurant: 'Restaurants', walgreens: 'Walgreens', cvs: 'CVS',
};

function fmt(key) { return CATEGORY_NAMES[key] || key; }

export default function WebSmartMatch({ category, merchantName, quarter }) {
  const [spends, setSpends] = useState({});
  const [matchingOffers, setMatchingOffers] = useState([]);

  useEffect(() => { getAllSpends(quarter).then(setSpends); }, [quarter]);

  useEffect(() => {
    if (!merchantName) return;
    getCachedDeals().then(({ deals }) => {
      setMatchingOffers(
        deals.filter((d) =>
          (d.bank === 'Chase' || d.bank === 'Discover') &&
          d.merchant.toLowerCase().includes(merchantName.toLowerCase())
        )
      );
    });
  }, [merchantName]);

  if (!category) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Wallet</span>
        </div>
        {cards.map((card) => {
          const fixedEntries = Object.entries(card.fixedBenefits).filter(([k]) => k !== 'other');
          const otherRate = card.fixedBenefits.other;
          const rotation = card.rotating[quarter];
          return (
            <div key={card.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: card.color }} />
                <div>
                  <p className="text-sm font-bold text-gray-800">{card.shortName}</p>
                  <p className="text-[10px] text-gray-400">{card.name}</p>
                </div>
              </div>
              {fixedEntries.length > 0 && (
                <div className="mb-2">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Fixed Benefits</p>
                  <div className="space-y-1">
                    {fixedEntries.map(([key, b]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-600">{fmt(key)}</span>
                        <span className="text-[11px] font-bold" style={{ color: card.color }}>{b.rate}{b.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {rotation && (
                <div className="mb-2">
                  <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wider mb-1.5">&#x1F525; Rotating ({quarter})</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-600">{rotation.categories.map(fmt).join(', ')}</span>
                    <span className="text-[11px] font-bold text-green-600">{rotation.rate}{rotation.unit === 'x' ? 'x' : '%'}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">Up to ${rotation.limit.toLocaleString()}</p>
                </div>
              )}
              {otherRate && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-1.5 mt-1.5">
                  <span className="text-[11px] text-gray-400">Everything else</span>
                  <span className="text-[11px] text-gray-400">{otherRate.rate}{otherRate.unit}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  const ranked = getBestCards(category, quarter, spends);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommendations for</span>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-100 rounded-full px-2.5 py-0.5 capitalize">{category}</span>
      </div>

      {matchingOffers.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 mb-1">
          <p className="text-[11px] font-semibold text-amber-700 mb-1">&#x1F4A1; Active Offers for {merchantName}</p>
          {matchingOffers.map((offer, i) => (
            <p key={i} className="text-[11px] text-amber-600">[{offer.bank}] {offer.deal}</p>
          ))}
        </div>
      )}

      {ranked.map((card, i) => {
        const style = RANK_STYLES[i] || RANK_STYLES[2];
        return (
          <div key={card.cardId} className={`rounded-xl border-2 ${style.border} ${style.bg} p-4 transition-all ${i === 0 ? 'shadow-md' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{style.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-gray-800">{card.shortName}</p>
                  <p className="text-[11px] text-gray-500">{card.cardName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black" style={{ color: card.color }}>{card.rate}{card.unit}</p>
                <p className="text-[10px] text-gray-400">~{card.effectiveValue.toFixed(1)}% value</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {card.isRotating && (
                <span className="inline-flex items-center bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">&#x1F525; Rotating 5%</span>
              )}
              {card.rotationMaxed && (
                <span className="inline-flex items-center bg-red-100 text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">Limit reached</span>
              )}
              <span className="text-[11px] text-gray-500">{card.reason}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
