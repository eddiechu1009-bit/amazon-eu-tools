import { TabId } from '../App';

const tabs: { id: TabId; label: string; icon: string; desc: string }[] = [
  { id: 'preregistration', label: '開帳號準備清單', icon: '📝', desc: '註冊前置作業與合規要求' },
  { id: 'wizard', label: '開站全流程', icon: '📋', desc: '一步步引導完成開站準備' },
  { id: 'compliance', label: '產品安規查詢', icon: '🔍', desc: '依品類查詢認證與佣金' },
  { id: 'incentives', label: '2026 新賣家大禮包', icon: '🎁', desc: '歐洲站點激勵方案總覽' },
];

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="bg-white border-b sticky top-[52px] z-40 shadow-sm" role="tablist">
      <div className="max-w-6xl mx-auto flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-3 text-center transition-all duration-200 border-b-3 min-w-[120px] ${
              activeTab === tab.id
                ? 'border-amazon-orange text-amazon-dark font-semibold bg-orange-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg mr-1">{tab.icon}</span>
            <span className="text-sm">{tab.label}</span>
            <div className="text-xs text-gray-400 mt-0.5 hidden sm:block">{tab.desc}</div>
          </button>
        ))}
      </div>
    </nav>
  );
}
