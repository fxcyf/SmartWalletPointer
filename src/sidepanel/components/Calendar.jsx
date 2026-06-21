import React from 'react';
import { getRotatingInfo } from '../../utils/matcher.js';

export default function Calendar({ quarter }) {
  const rotations = getRotatingInfo(quarter);

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
        rotations.map((item) => (
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
                  Limit: ${item.rotation.limit.toLocaleString()}
                </span>
                <span className="font-semibold text-gray-700">
                  {item.rotation.rate}{item.rotation.unit === 'x' ? 'x' : '%'} back
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all"
                  style={{ width: '0%' }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                $0 / ${item.rotation.limit.toLocaleString()} used (Phase 2: manual tracking)
              </p>
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
        ))
      )}
    </div>
  );
}
