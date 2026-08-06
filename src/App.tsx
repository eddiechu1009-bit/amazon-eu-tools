import { useState, useEffect } from 'react';
import CountrySelector from './components/CountrySelector';
import CategorySelector from './components/CategorySelector';
import TabNav from './components/TabNav';
import WizardView from './components/WizardView';
import ComplianceChecker from './components/ComplianceChecker';
import PreRegistration from './components/PreRegistration';
import NewSellerIncentives from './components/NewSellerIncentives';
import { CountryCode } from './data/types';

export type TabId = 'wizard' | 'compliance' | 'preregistration' | 'incentives';

// 站點與品類選擇也要記住。原本只有勾選狀態存 localStorage，重新開頁會變成
// 「已完成 N 項」卻要求重新選國家，看起來像資料丟了。
const SETUP_STORAGE_KEY = 'eu-tools-setup-v1';

function loadSetup(): { countries: CountryCode[]; categories: string[] } {
  try {
    const raw = localStorage.getItem(SETUP_STORAGE_KEY);
    if (!raw) return { countries: [], categories: [] };
    const parsed = JSON.parse(raw);
    return {
      countries: Array.isArray(parsed.countries) ? parsed.countries : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
    };
  } catch {
    return { countries: [], categories: [] };
  }
}

export default function App() {
  const saved = loadSetup();
  const [selectedCountries, setSelectedCountries] = useState<CountryCode[]>(saved.countries);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(saved.categories);
  const [activeTab, setActiveTab] = useState<TabId>('preregistration');
  // 之前選過國家就直接進主畫面，不用再走一次歡迎頁
  const [started, setStarted] = useState(saved.countries.length > 0);

  useEffect(() => {
    try {
      localStorage.setItem(
        SETUP_STORAGE_KEY,
        JSON.stringify({ countries: selectedCountries, categories: selectedCategories })
      );
    } catch {
      // localStorage 不可用（隱私模式等）時忽略，不影響功能
    }
  }, [selectedCountries, selectedCategories]);

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amazon-dark to-amazon-light p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 text-center animate-fadeInScale">
          <div className="text-5xl mb-3 animate-bounce">🛠️</div>
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
          <span className="text-2xl">🛠️</span>
          <div>
            <h1 className="text-lg font-semibold">Amazon 歐洲新賣家準備工具</h1>
            <p className="text-xs text-gray-400">開站全流程 · 安規查詢 · 前置清單</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CountrySelector selected={selectedCountries} onChange={setSelectedCountries} compact />
          <button
            onClick={() => {
              // 真正清空選擇，否則重整後 loadSetup() 又會把使用者帶回主畫面
              setSelectedCountries([]);
              setSelectedCategories([]);
              setActiveTab('preregistration');
              setStarted(false);
            }}
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
        <div className="max-w-3xl mx-auto px-4">
          <p className="mb-2">
            ⚠️ <span className="font-semibold">資料免責聲明</span>：本工具中的費用、時程、認證費用與服務代理費皆為市場估算值，實際以認證機構、稅務代理或 Seller Central 報價為準。
            金額單位（USD ↔ EUR ↔ GBP）以 Amazon 內部換算基準為準，實際金額以 Seller Central 顯示為準。
          </p>
          <p>資料來源：Amazon Seller Central、歐盟官方法規、GOV.UK、Amazon Taiwan 官方公告等。內容僅供參考。</p>
          <p className="mt-1">最後更新：2026年8月</p>
        </div>
        {/*
          這支是新賣家的起點，刻意「不」連到首頁與營運／帳務／Case 三支工具：
          那些是註冊完成後、開賣後才用得到的，對還在開帳號的人只會增加雜訊。
          只保留 KYC 自檢 —— KYC 不分新舊賣家，開帳號、改地址、Ongoing 抽查都會遇到，
          是這個階段真正可能需要的下一步。
        */}
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <a href="https://eu-seller-101.netlify.app/01" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-100 hover:bg-amazon-orange/10 hover:text-amazon-dark rounded-lg transition-all duration-200">📖 這個工具怎麼用</a>
          <a href="https://passkyc.netlify.app/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-amazon-orange/10 text-amazon-dark hover:bg-amazon-orange hover:text-white rounded-lg transition-all duration-200 font-medium">🪪 KYC 提交前自檢</a>
        </div>
        <p className="mt-2 text-xs text-gray-400">KYC 不分新舊賣家都可能遇到，卡在身分驗證時可用</p>
      </footer>
    </div>
  );
}
