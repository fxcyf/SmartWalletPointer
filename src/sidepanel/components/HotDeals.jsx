import React, { useState, useEffect } from 'react';
import { getCachedDeals } from '../../utils/storage.js';
import { filterRelevantDeals } from '../../utils/rss.js';
import api from '../../utils/browser.js';


function formatTimeAgo(timestamp) {
  if (!timestamp) return null;
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function HotDeals({ currentMerchant }) {
  const [deals, setDeals] = useState([]);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      setLoading(true);
      const cached = await getCachedDeals();
      if (cached.deals.length > 0) {
        setDeals(cached.deals);
        setFetchedAt(cached.fetchedAt);
      }
      setLoading(false);
    }
    loadDeals();
  }, []);

  useEffect(() => {
    function handleMessage(msg) {
      if (msg.type === 'DEALS_UPDATED' && msg.deals) {
        setDeals(msg.deals);
        setFetchedAt(Date.now());
      }
    }
    if (api?.runtime?.onMessage) {
      api.runtime.onMessage.addListener(handleMessage);
      return () => api.runtime.onMessage.removeListener(handleMessage);
    }
  }, []);

  function handleRefresh() {
    if (api?.runtime?.sendMessage) {
      api.runtime.sendMessage({ type: 'REFRESH_DEALS' }).catch(() => {});
    }
  }

  const relevantDeals = showAll ? deals : filterRelevantDeals(deals);

  const merchantDeals = currentMerchant
    ? relevantDeals.filter((d) =>
        d.merchant.toLowerCase().includes(currentMerchant.toLowerCase())
      )
    : [];
  const otherDeals = currentMerchant
    ? relevantDeals.filter(
        (d) => !d.merchant.toLowerCase().includes(currentMerchant.toLowerCase())
      )
    : relevantDeals;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-bold text-gray-700">Hot Deals</h2>
        <div className="flex items-center gap-2">
          {fetchedAt && (
            <span className="text-[10px] text-gray-400">
              {formatTimeAgo(fetchedAt)}
            </span>
          )}
          <button
            onClick={handleRefresh}
            className="text-[10px] text-indigo-500 hover:text-indigo-700 font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setShowAll(false)}
          className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
            !showAll
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          My Cards
        </button>
        <button
          onClick={() => setShowAll(true)}
          className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
            showAll
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          All Banks
        </button>
      </div>

      {merchantDeals.length > 0 && (
        <>
          <p className="text-[11px] font-semibold text-green-600 uppercase tracking-wider">
            &#x2B50; Matching current site
          </p>
          {merchantDeals.map((deal, i) => (
            <DealCard key={`match-${i}`} deal={deal} highlight />
          ))}
          {otherDeals.length > 0 && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Other deals</p>
            </div>
          )}
        </>
      )}

      {otherDeals.length === 0 && merchantDeals.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No deals available. Try refreshing.
        </p>
      ) : (
        otherDeals.map((deal, i) => <DealCard key={`other-${i}`} deal={deal} />)
      )}
    </div>
  );
}

function DealCard({ deal, highlight }) {
  const bankColors = {
    Chase: 'bg-chase',
    Discover: 'bg-discover',
    Amex: 'bg-blue-500',
    Citi: 'bg-blue-700',
    'Capital One': 'bg-red-600',
    BofA: 'bg-red-700',
  };

  return (
    <a
      href={deal.link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-start gap-3 rounded-lg border p-3 shadow-sm transition-colors hover:bg-gray-50 ${
        highlight
          ? 'border-green-300 bg-green-50/50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <span
        className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-md text-white ${
          bankColors[deal.bank] || 'bg-gray-500'
        }`}
      >
        {deal.bank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800 truncate">{deal.merchant}</p>
        <p className="text-xs text-gray-500 line-clamp-2">{deal.deal}</p>
        <span className="text-[10px] text-gray-400 mt-0.5 inline-block">{deal.category}</span>
      </div>
    </a>
  );
}
