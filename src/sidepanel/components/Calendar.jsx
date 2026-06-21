import React, { useState, useEffect } from 'react';
import { getRotatingInfo } from '../../utils/matcher.js';
import { getSpend, setSpend } from '../../utils/storage.js';

export default function Calendar({ quarter }) {
  const rotations = getRotatingInfo(quarter);
  const [spends, setSpends] = useState({});
  const [editingCard, setEditingCard] = useState(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    async function loadSpends() {
      const loaded = {};
      for (const item of rotations) {
        loaded[item.cardId] = await getSpend(item.cardId, quarter);
      }
      setSpends(loaded);
    }
    loadSpends();
  }, [quarter, rotations.length]);

  async function handleSaveSpend(cardId) {
    const amount = parseFloat(inputValue);
    if (isNaN(amount) || amount < 0) return;
    await setSpend(cardId, quarter, amount);
    setSpends((prev) => ({ ...prev, [cardId]: amount }));
    setEditingCard(null);
    setInputValue('');
  }

  function startEditing(cardId, currentSpend) {
    setEditingCard(cardId);
    setInputValue(String(currentSpend || 0));
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-700">5% Rotating Categories</h2>
        <span className="text-xs font-semibold bg-indigo-100 text-indigo-600 rounded-full px-2.5 py-0.5">
          {quarter}
        </span>
      </div>

      {rotations.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No rotating categories this quarter.
        </p>
      ) : (
        rotations.map((item) => {
          const spent = spends[item.cardId] || 0;
          const limit = item.rotation.limit;
          const pct = Math.min(100, (spent / limit) * 100);
          const remaining = Math.max(0, limit - spent);
          const isNearLimit = pct >= 80;
          const isMaxed = pct >= 100;

          return (
            <div
              key={item.cardId}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-bold text-gray-800">{item.shortName}</span>
                <span className="text-xs text-gray-400">{item.cardName}</span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">
                    Limit: ${limit.toLocaleString()}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {item.rotation.rate}{item.rotation.unit === 'x' ? 'x' : '%'} back
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isMaxed
                        ? 'bg-red-400'
                        : isNearLimit
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <p className={`text-[11px] font-medium ${isMaxed ? 'text-red-500' : isNearLimit ? 'text-amber-600' : 'text-gray-500'}`}>
                    ${spent.toLocaleString()} / ${limit.toLocaleString()} used
                    {isMaxed && ' — Maxed out!'}
                    {isNearLimit && !isMaxed && ` — $${remaining.toLocaleString()} left`}
                  </p>
                  {editingCard === item.cardId ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-gray-400">$</span>
                      <input
                        type="number"
                        min="0"
                        max={limit}
                        step="0.01"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveSpend(item.cardId)}
                        className="w-20 text-[11px] border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-indigo-400"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveSpend(item.cardId)}
                        className="text-[10px] bg-indigo-500 text-white rounded px-2 py-0.5 hover:bg-indigo-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCard(null)}
                        className="text-[10px] text-gray-400 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(item.cardId, spent)}
                      className="text-[10px] text-indigo-500 hover:text-indigo-700 font-medium"
                    >
                      Edit spend
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {item.rotation.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-[11px] bg-gray-100 text-gray-600 rounded-md px-2 py-1 font-medium capitalize"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
