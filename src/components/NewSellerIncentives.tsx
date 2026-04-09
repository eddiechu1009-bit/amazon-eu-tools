import { useState } from 'react';

interface IncentiveItem {
  id: string;
  title: string;
  category: 'brand' | 'fba' | 'ads' | 'tools';
  value: string;
  description: string;
  howToGet: string[];
  deadline: string;
  tips?: string[];
}

const incentiveData: IncentiveItem[] = [
  {
    id: 'brand-bonus-10',
    title: '品牌銷售 10% 返利（首 €40,000）',
    category: 'brand',
    value: '最高 €4,000',
    description: '完成品牌註冊後，首 €40,000（UK: £40,000）的品牌商品銷售額可獲得 10% 佣金回饋',
    howToGet: [
      '在上架第一個商品後 6 個月內完成 Amazon Brand Registry',
      '需擁有政府核發的商標（已註冊或申請中）',
      '返利以佣金抵扣的方式，自動套用到下個月的訂單',
    ],
    deadline: '上架首個商品後 6 個月內完成品牌註冊',
    tips: [
      '台灣賣家可使用台灣智慧財產局核發的商標',
      '建議在開帳號前就先申請商標，加速流程',
      '返利會在銷售完成後約 2 個月入帳（扣除退貨期）',
    ],
  },
  {
    id: 'brand-bonus-5',
    title: '品牌銷售 5% 返利（€40,000 之後）',
    category: 'brand',
    value: '最高約 €38,000',
    description: '超過首 €40,000 後，繼續享有 5% 佣金回饋，直到累計銷售達 €800,000（UK: £800,000）或總返利達 €42,000（UK: £42,000）',
    howToGet: [
      '延續上一項，無需額外申請',
      '持續銷售品牌註冊商品即可',
    ],
    deadline: '資格生效後 12 個月內使用完畢',
    tips: [
      '返利上限：€42,000（UK: £42,000），約等於 $50,000 USD',
      '累計銷售達 €800,000 後返利自動停止',
      '這筆錢最適合拿來支撐第一次大量補貨的現金流',
    ],
  },
  {
    id: 'vine-credits',
    title: 'Amazon Vine 評論額度',
    category: 'brand',
    value: '€160（UK: £160）',
    description: '免費使用 Amazon Vine 計畫，讓受信任的評論者為你的新品撰寫真實評論',
    howToGet: [
      '完成品牌註冊後自動獲得',
      '在 Seller Central 的 Vine 頁面登記商品',
    ],
    deadline: '品牌註冊完成後即可使用',
    tips: [
      '新品最缺的就是評論，Vine 是最快取得高品質評論的方式',
      '建議優先用在主力商品上',
    ],
  },
  {
    id: 'fba-shipping-credits',
    title: 'FBA 入倉運費抵扣',
    category: 'fba',
    value: '€80 入倉運費 或 €160 AGL 物流費（UK: £80 / £160）',
    description: '使用 Amazon 合作承運商（Partnered Carrier）入倉可獲 €80 抵扣；使用 Amazon Global Logistics（AGL）可獲 €160 抵扣',
    howToGet: [
      '在帳號註冊後 90 天內啟用 FBA',
      '透過 Seller Central 建立 FBA Shipment',
    ],
    deadline: '註冊後 90 天內啟用 FBA',
    tips: [
      '建議使用 AGL 可拿到更高的 €160 抵扣',
      '首批入倉建議少量測試，確認流程順暢',
    ],
  },
  {
    id: 'fba-new-selection',
    title: 'FBA 新品免倉儲費',
    category: 'fba',
    value: '免費倉儲 + 免費退貨處理',
    description: '自動加入 FBA New Selection 計畫，新上架的 FBA 商品享有免費月倉儲費、免費移除和退貨處理',
    howToGet: [
      '啟用 FBA 後自動加入',
      '適用於首次使用 FBA 的 ASIN',
    ],
    deadline: '首次 FBA 入倉後 365 天內',
    tips: [
      '這段期間可以大膽測試更多品項，不用擔心倉儲費',
      '365 天內不會被收取倉儲利用率附加費',
    ],
  },
  {
    id: 'fba-storage-exempt',
    title: '倉儲利用率附加費豁免',
    category: 'fba',
    value: '首年免收',
    description: '新賣家首次 FBA 入倉後 365 天內，豁免倉儲利用率附加費（Storage Utilisation Surcharge）',
    howToGet: ['啟用 FBA 後自動適用'],
    deadline: '首次入倉後 365 天',
  },
  {
    id: 'ads-credits',
    title: 'Sponsored Products 廣告額度',
    category: 'ads',
    value: '最高 €750（UK: £750）',
    description: '免費的商品推廣廣告額度，用於啟動 Sponsored Products 廣告活動',
    howToGet: [
      '在帳號註冊後 90 天內建立第一個 Sponsored Products 廣告活動',
      '額度會自動加入廣告預算',
    ],
    deadline: '註冊後 90 天內啟動廣告',
    tips: [
      '€750 的廣告額度足以測試 3-5 個主力商品的關鍵字',
      '建議搭配自動投放 + 手動投放雙管齊下',
      '先用自動投放跑 2 週收集數據，再轉手動精準投放',
    ],
  },
  {
    id: 'coupon-credits',
    title: '優惠券額度',
    category: 'tools',
    value: '€40（UK: £40）',
    description: '免費建立 Amazon 優惠券（Coupons），吸引買家點擊和購買',
    howToGet: [
      '在 Seller Central 的促銷工具中建立優惠券',
      '額度自動套用',
    ],
    deadline: '註冊後 12 個月內',
    tips: [
      '優惠券會在搜尋結果中顯示綠色標籤，提升點擊率',
      '建議設定 5-15% 的折扣幅度，兼顧吸引力和利潤',
    ],
  },
];

const categoryInfo: Record<string, { label: string; icon: string; color: string }> = {
  brand: { label: '品牌註冊福利', icon: '🏷️', color: 'bg-purple-50 border-purple-200' },
  fba: { label: 'FBA 物流福利', icon: '📦', color: 'bg-blue-50 border-blue-200' },
  ads: { label: '廣告推廣福利', icon: '📢', color: 'bg-orange-50 border-orange-200' },
  tools: { label: '促銷工具福利', icon: '🛠️', color: 'bg-green-50 border-green-200' },
};

export default function NewSellerIncentives() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const grouped = incentiveData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, IncentiveItem[]>);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-amazon-dark to-amazon-light rounded-2xl p-4 sm:p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl sm:text-4xl">🎁</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">2026 新賣家大禮包</h2>
            <p className="text-white/70 text-sm">歐洲站點激勵方案，最高價值超過 $50,000 美元</p>
          </div>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          Amazon 為新進賣家提供一系列啟動資源，涵蓋品牌返利、物流優惠、廣告額度和促銷工具。
          善用這些資源，能有效降低開站初期的成本壓力，加速品牌在歐洲市場的成長。
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center border-t-4 border-purple-400">
          <div className="text-lg sm:text-xl font-bold text-purple-700">€42,000+</div>
          <div className="text-xs text-gray-500">品牌銷售返利</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center border-t-4 border-blue-400">
          <div className="text-lg sm:text-xl font-bold text-blue-700">€160+</div>
          <div className="text-xs text-gray-500">FBA 物流抵扣</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center border-t-4 border-orange-400">
          <div className="text-lg sm:text-xl font-bold text-orange-700">€750</div>
          <div className="text-xs text-gray-500">廣告額度</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center border-t-4 border-green-400">
          <div className="text-lg sm:text-xl font-bold text-green-700">€200+</div>
          <div className="text-xs text-gray-500">Vine + 優惠券</div>
        </div>
      </div>

      {/* Key timeline */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h3 className="font-bold text-amazon-dark mb-3">⏰ 關鍵時間節點</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <span className="w-16 sm:w-20 text-right font-mono font-bold text-amazon-orange flex-shrink-0 text-xs sm:text-sm">第 1 天</span>
            <div className="w-3 h-3 rounded-full bg-amazon-orange flex-shrink-0" />
            <span>註冊帳號，開始計算所有優惠期限</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <span className="w-16 sm:w-20 text-right font-mono font-bold text-blue-600 flex-shrink-0 text-xs sm:text-sm">90 天內</span>
            <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
            <span>啟用 FBA + 啟動 Sponsored Products 廣告</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <span className="w-16 sm:w-20 text-right font-mono font-bold text-purple-600 flex-shrink-0 text-xs sm:text-sm">6 個月內</span>
            <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0" />
            <span>完成品牌註冊，解鎖 10%/5% 返利</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <span className="w-16 sm:w-20 text-right font-mono font-bold text-green-600 flex-shrink-0 text-xs sm:text-sm">12 個月</span>
            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
            <span>所有優惠到期，未使用的額度將失效</span>
          </div>
        </div>
      </div>

      {/* 90-day strategy */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="font-bold text-amber-800 mb-2">💡 90 天加速策略</h3>
        <p className="text-sm text-amber-700 mb-3">
          數據顯示：入駐首 90 天內完成《新賣家入門指南》的賣家，首年銷售額平均高出一般賣家 6 倍。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-sm">
          <div className="bg-white rounded-lg p-3 border border-amber-100">
            <div className="font-semibold text-amber-800 mb-1">第 1-2 週</div>
            <p className="text-gray-600">完成帳號設定、上架商品、建立 FBA Shipment 截圖（申請 VAT 用）</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-amber-100">
            <div className="font-semibold text-amber-800 mb-1">第 3-4 週</div>
            <p className="text-gray-600">啟動 FBA 入倉、開始 Sponsored Products 廣告、申請品牌註冊</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-amber-100">
            <div className="font-semibold text-amber-800 mb-1">第 2-3 個月</div>
            <p className="text-gray-600">優化廣告投放、分析銷售數據、準備補貨、啟用 A+ 內容</p>
          </div>
        </div>
      </div>

      {/* Incentive details by category */}
      {Object.entries(categoryInfo).map(([catKey, catMeta]) => {
        const items = grouped[catKey];
        if (!items) return null;
        return (
          <div key={catKey} className="mb-6">
            <h3 className="text-lg font-bold text-amazon-dark mb-3 flex items-center gap-2">
              <span>{catMeta.icon}</span> {catMeta.label}
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className={`rounded-xl border-2 shadow-sm ${catMeta.color}`}>
                  <div
                    className="flex items-start gap-3 p-4 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800">{item.title}</span>
                        <span className="text-xs px-2 py-0.5 bg-amazon-orange/20 text-amazon-dark rounded-full font-bold">
                          {item.value}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-white/80 text-gray-600 rounded">
                          ⏱ 期限：{item.deadline}
                        </span>
                      </div>
                    </div>
                    <span className={`text-gray-400 transition-transform duration-200 ${expandedId === item.id ? 'rotate-180' : ''}`}>▼</span>
                  </div>

                  {expandedId === item.id && (
                    <div className="px-3 sm:px-4 pb-4 border-t border-gray-200/50 animate-fadeIn">
                      <div className="pt-3 space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">🎯 如何取得</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {item.howToGet.map((step, i) => (
                              <li key={i} className="flex gap-1">
                                <span className="text-gray-400 flex-shrink-0">{i + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {item.tips && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">💡 實用建議</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {item.tips.map((tip, i) => (
                                <li key={i} className="flex gap-1">
                                  <span className="text-gray-400">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Cost info */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
        <h3 className="font-bold text-amazon-dark mb-2">💰 開店成本</h3>
        <p className="text-sm text-gray-600">
          專業賣家方案月費 $39.99 美元，一個帳號即可同時經營歐洲五國站點（DE/FR/IT/ES/UK），
          月費不重複計算。搭配新賣家大禮包的各項優惠，首年的實際營運成本可大幅降低。
        </p>
        <p className="text-xs text-gray-400 mt-3">
          資料來源：Amazon Seller Central 官方 / Amazon New Seller Incentives（歐洲站點）。
          金額以歐元計，英國站點以英鎊計，實際金額以 Seller Central 顯示為準。
        </p>
      </div>

      {/* EU4/UK Split notice */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">📢 重要變更：EU4 / UK 分拆計算</h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          原本歐洲五國（EU5）的新賣家激勵方案，將拆分為 <span className="font-semibold">EU4（德國、法國、義大利、西班牙）</span> 和 <span className="font-semibold">UK（英國）</span> 兩個獨立區域分別計算。
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="font-semibold text-blue-800 text-sm mb-1">🇪🇺 EU4 站點</div>
            <p className="text-xs text-gray-600">德國、法國、義大利、西班牙視為一個區域，共享一組新賣家激勵額度</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="font-semibold text-blue-800 text-sm mb-1">🇬🇧 UK 站點</div>
            <p className="text-xs text-gray-600">英國獨立為一個區域，另外享有一組完整的新賣家激勵額度</p>
          </div>
        </div>
        <p className="text-sm text-blue-700 mt-3">
          ✅ 這代表符合資格的賣家可以<span className="font-semibold">分別在 EU4 和 UK 各領取一次完整的新賣家大禮包</span>，等於激勵總額翻倍。
        </p>
        <p className="text-xs text-gray-400 mt-2">
          資料來源：Amazon New Seller Incentives 政策更新（EU4/UK Split）。實際適用條件以 Seller Central 公告為準。
        </p>
      </div>
    </div>
  );
}
