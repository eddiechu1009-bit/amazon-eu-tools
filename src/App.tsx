import { useState } from 'react';
import CountrySelector from './components/CountrySelector';
import CategorySelector from './components/CategorySelector';
import TabNav from './components/TabNav';
import WizardView from './components/WizardView';
import ComplianceChecker from './components/ComplianceChecker';
import PreRegistration from './components/PreRegistration';
import NewSellerIncentives from './components/NewSellerIncentives';
import { CountryCode } from './data/types';

export type TabId = 'wizard' | 'compliance' | 'preregistration' | 'incentives';

export default function App() {
  const [selectedCountries, setSelectedCountries] = useState<CountryCode[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('preregistration');
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amazon-dark to-amazon-light p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 text-center animate-fadeInScale">
          <div className="text-5xl mb-3 animate-bounce">🇪🇺</div>
          <h1 className="text-3xl font-bold text-amazon-dark mb-2">Amazon 歐洲新賣家準備工具</h1>
          <p className="text-gray-500 mb-6">一站式引導你完成歐洲五國開站的所有準備工作</p>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3 font-medium">🌍 請先選擇你要開設的站點國家：</p>
            <CountrySelector selected={selectedCountries} onChange={setSelectedCountries} />
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-3 font-medium">📦 選擇你要販售的商品品類（可多選）：</p>
            <CategorySelector selected={selectedCategories} onChange={setSelectedCategories} />
          </div>

          <button
            onClick={() => selectedCountries.length > 0 && setStarted(true)}
            disabled={selectedCountries.length === 0}
            className="px-8 py-3 bg-amazon-orange text-white font-semibold rounded-lg
              hover:bg-orange-500 hover:shadow-lg hover:-translate-y-0.5
              transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none text-lg"
          >
            開始使用 →
          </button>

          {selectedCountries.length === 0 && (
            <p className="text-xs text-amber-500 mt-3 animate-fadeIn">⬆ 請至少選擇一個國家才能開始</p>
          )}

          <p className="text-xs text-gray-400 mt-6">
            資料來源：Amazon Seller Central、歐盟官方法規、GOV.UK 等公開資料。
            <br />費用與時程為估算值，實際情況可能因個案而異。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-amazon-dark text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🇪🇺</span>
          <div>
            <h1 className="text-lg font-semibold">Amazon 歐洲新賣家準備工具</h1>
            <p className="text-xs text-gray-400">開站全流程 · 安規查詢 · 前置清單</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CountrySelector selected={selectedCountries} onChange={setSelectedCountries} compact />
          <button
            onClick={() => { setStarted(false); setActiveTab('preregistration'); }}
            className="text-xs text-gray-400 hover:text-white ml-2"
          >
            重新開始
          </button>
        </div>
      </header>

      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {activeTab === 'wizard' && <WizardView countries={selectedCountries} />}
        {activeTab === 'compliance' && <ComplianceChecker countries={selectedCountries} selectedCategories={selectedCategories} onCategoriesChange={setSelectedCategories} />}
        {activeTab === 'preregistration' && <PreRegistration countries={selectedCountries} selectedCategories={selectedCategories} />}
        {activeTab === 'incentives' && <NewSellerIncentives />}
      </main>

      <footer className="text-center text-xs text-gray-400 py-6 border-t">
        資料來源：Amazon Seller Central、歐盟官方法規、GOV.UK 等。費用與時程為估算值，僅供參考。
        <br />最後更新：2026年4月
      </footer>
    </div>
  );
}
