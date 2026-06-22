import React, { useState, useCallback } from 'react';
import { getCategoryFromUrl, getMerchantName } from '../data/merchants.js';
import { getCurrentQuarter } from '../utils/matcher.js';
import WebSmartMatch from './components/WebSmartMatch.jsx';
import WebCalendar from './components/WebCalendar.jsx';
import WebHotDeals from './components/WebHotDeals.jsx';

const TABS = [
  { id: 'match', label: 'Smart Match' },
  { id: 'calendar', label: '5% Calendar' },
  { id: 'deals', label: 'Hot Deals' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('match');
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState(null);
  const [merchantName, setMerchantName] = useState(null);
  const [clipboardError, setClipboardError] = useState(null);
  const [quarter] = useState(getCurrentQuarter());

  const processInput = useCallback((text) => {
    if (!text.trim()) {
      setCategory(null);
      setMerchantName(null);
      return;
    }
    let url = text.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    const cat = getCategoryFromUrl(url);
    const name = getMerchantName(url);
    setCategory(cat);
    setMerchantName(name);
  }, []);

  function handleInputChange(e) {
    setInputValue(e.target.value);
    processInput(e.target.value);
  }

  function handleClear() {
    setInputValue('');
    setCategory(null);
    setMerchantName(null);
    setClipboardError(null);
  }

  async function handlePaste() {
    setClipboardError(null);
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputValue(text.trim());
        processInput(text.trim());
      }
    } catch {
      setClipboardError('Clipboard access denied. Paste manually.');
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white shadow-lg safe-top">
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-bold tracking-tight">SmartWallet Pointers</h1>
          <p className="text-[10px] text-indigo-200 mt-0.5">Paste a merchant URL or link to get card recommendations</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto w-full px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="amazon.com, doordash.com..."
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                &times;
              </button>
            )}
          </div>
          <button
            onClick={handlePaste}
            className="shrink-0 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            Paste
          </button>
        </div>
        {clipboardError && (
          <p className="text-[11px] text-red-500 mt-1.5">{clipboardError}</p>
        )}
        {merchantName && category && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">Detected:</span>
            <span className="text-xs font-semibold text-indigo-600 capitalize">{merchantName}</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-600 rounded-full px-2 py-0.5 uppercase tracking-wide">
              {category}
            </span>
          </div>
        )}
        {inputValue && !category && (
          <p className="text-[11px] text-amber-500 mt-1.5">
            Merchant not recognized. Try a full URL like amazon.com
          </p>
        )}
      </div>

      <nav className="flex border-b border-gray-200 bg-white max-w-lg mx-auto w-full">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-xs font-semibold tracking-wide transition-colors ${
              activeTab === tab.id
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 overflow-y-auto pb-8 max-w-lg mx-auto w-full">
        {activeTab === 'match' && (
          <WebSmartMatch category={category} merchantName={merchantName} quarter={quarter} />
        )}
        {activeTab === 'calendar' && <WebCalendar quarter={quarter} />}
        {activeTab === 'deals' && <WebHotDeals currentMerchant={merchantName} />}
      </main>
    </div>
  );
}
