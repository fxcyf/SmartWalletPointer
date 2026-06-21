import React, { useState, useEffect } from 'react';
import SmartMatch from './components/SmartMatch.jsx';
import Calendar from './components/Calendar.jsx';
import HotDeals from './components/HotDeals.jsx';
import { getCategoryFromUrl, getMerchantName } from '../data/merchants.js';
import { getCurrentQuarter } from '../utils/matcher.js';

const TABS = [
  { id: 'match', label: 'Smart Match' },
  { id: 'calendar', label: '5% Calendar' },
  { id: 'deals', label: 'Hot Deals' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('match');
  const [currentUrl, setCurrentUrl] = useState(null);
  const [category, setCategory] = useState(null);
  const [merchantName, setMerchantName] = useState(null);
  const [quarter] = useState(getCurrentQuarter());

  useEffect(() => {
    function handleMessage(message) {
      if (message.type === 'TAB_UPDATED' && message.url) {
        setCurrentUrl(message.url);
        setCategory(getCategoryFromUrl(message.url));
        setMerchantName(getMerchantName(message.url));
      }
    }

    if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
      chrome.runtime.onMessage.addListener(handleMessage);

      chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs?.[0]?.url) {
          setCurrentUrl(tabs[0].url);
          setCategory(getCategoryFromUrl(tabs[0].url));
          setMerchantName(getMerchantName(tabs[0].url));
        }
      });

      return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white shadow-lg">
        <h1 className="text-lg font-bold tracking-tight">SmartWallet Pointers</h1>
        {merchantName && (
          <p className="text-xs text-indigo-200 mt-0.5">
            Browsing: <span className="font-medium text-white capitalize">{merchantName}</span>
            {category && (
              <span className="ml-1.5 bg-white/20 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide">
                {category}
              </span>
            )}
          </p>
        )}
      </header>

      <nav className="flex border-b border-gray-200 bg-white">
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

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'match' && (
          <SmartMatch category={category} merchantName={merchantName} quarter={quarter} />
        )}
        {activeTab === 'calendar' && <Calendar quarter={quarter} />}
        {activeTab === 'deals' && <HotDeals currentMerchant={merchantName} />}
      </main>
    </div>
  );
}
