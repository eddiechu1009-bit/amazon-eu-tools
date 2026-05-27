import { useState } from 'react';

interface IncentiveItem {
  id: string;
  title: string;
  category: 'brand' | 'fba' | 'ads' | 'tools' | 'b2b';
  value: string;
  description: string;
  howToGet: string[];
  deadline: string;
  tips?: string[];
  source?: { label: string; url: string };
}

// 資料來源（已驗證可訪問）：
// [TW]    Amazon Taiwan 2026/2/12 官方公告
//         https://gs.amazon.com.tw/news/2026-why-you-need-to-sell-on-amazon-260209
// [UK]    Amazon UK 官方賣家頁
//         https://sell.amazon.co.uk/sell-online
// [CMAX]  ChannelMAX 2026/04 報導（EU4 €47,250 / 7 天撥款 / EU4-UK Split）
//         https://www.channelmax.net/article/amazon-speeds-up-new-brand-bonus-payouts-for-uk-sellers-splits-uk-and-eu-incentives-channelmax
// [EUFEE] Amazon EU 官方部落格 2025/12/2（2026 fee 降價 + Low-Price FBA 擴大）
//         https://www.aboutamazon.eu/news/empowering-small-business/update-to-european-referral-and-fulfilment-by-amazon-fees-for-2026
// [HELP]  Amazon Seller Central Help Page (US): GXMJ38VA95GUN5XU
//         https://sellercentral.amazon.com/help/hub/reference/GXMJ38VA95GUN5XU

const TW_SOURCE = { label: 'Amazon TW 官方公告', url: 'https://gs.amazon.com.tw/news/2026-why-you-need-to-sell-on-amazon-260209' };
const UK_SOURCE = { label: 'sell.amazon.co.uk 官方頁', url: 'https://sell.amazon.co.uk/sell-online' };
const CMAX_SOURCE = { label: 'ChannelMAX 2026/04 報導', url: 'https://www.channelmax.net/article/amazon-speeds-up-new-brand-bonus-payouts-for-uk-sellers-splits-uk-and-eu-incentives-channelmax' };
const EUFEE_SOURCE = { label: 'Amazon EU 官方部落格 2025/12/2', url: 'https://www.aboutamazon.eu/news/empowering-small-business/update-to-european-referral-and-fulfilment-by-amazon-fees-for-2026' };
const NSI_DASHBOARD_URL = 'https://sellercentral.amazon.com/incentives';

const incentiveData: IncentiveItem[] = [
  {
    id: 'brand-bonus',
    title: '品牌銷售返利（10% + 5%）',
    category: 'brand',
    value: '$52,500 USD 等值 · UK £42,000 · EU4 €47,250',
    description: '完成品牌註冊後，前 $50,000（UK £40,000）品牌商品銷售給 10% 佣金回饋；之後到上限給 5%。回饋以折抵下期佣金的方式發放',
    howToGet: [
      '在上架第一個 buyable ASIN 之前，或之後 6 個月內完成 Amazon Brand Registry',
      '需擁有政府核發的商標（已註冊或申請中）',
      '需為該品牌在 Brand Registry 的第一位 owner',
      'UK 站 2026/3/26 起，符合資格後 7 天內發放抵用額（取代過去的次月撥款）',
    ],
    deadline: '上架首個 buyable ASIN 起 1 年內 / 抵用額用完',
    tips: [
      '📌 EU4 與 UK 已分拆計算，符合資格的賣家可在兩區各領一份',
      '📌 UK 站：£42,000（前 £40K 給 10% = £4,000；之後 5% 至 £800K 累計 £42,000 上限）',
      '📌 EU4：€47,250（與美元 $52,500 等值，由 Amazon 內部統一基準換算）',
      '📌 兩區合計 ≈ $100,000 USD 等值的返利空間',
      '台灣賣家可使用台灣智慧財產局核發的商標申請美國 Brand Registry，但歐盟/英國 Brand Registry 仍需 EUIPO / UKIPO 商標',
      '建議在上架前就先申請商標，加速流程（IP Accelerator 申請中即可使用）',
    ],
    source: CMAX_SOURCE,
  },
  {
    id: 'vine-credits',
    title: 'Amazon Vine 評論額度',
    category: 'brand',
    value: '$200 USD 等值（UK £160）',
    description: '免費使用 Amazon Vine 計畫，由受信任的評論者為新品撰寫真實評論',
    howToGet: [
      '完成品牌註冊後自動獲得',
      '需在符合資格起 90 天內到 Seller Central 的 Vine 頁面註冊商品',
      '同一筆額度只能用於 Vine 註冊費，無法折抵其他費用',
    ],
    deadline: '符合資格後 1 年內未使用即過期',
    tips: [
      '📌 注意：若在符合資格後 5 天內就註冊 Vine，雖然會拿到額度但**無法**折抵該次註冊費（Amazon 系統限制）',
      '建議等滿 5 天後再註冊，確保額度能正確套用',
      '新品最缺的就是評論，Vine 是最快取得高品質評論的方式',
      '建議優先用在主力商品上',
    ],
    source: TW_SOURCE,
  },
  {
    id: 'fba-shipping-credits',
    title: 'FBA 入倉物流抵用',
    category: 'fba',
    value: 'UK £80（Partnered Carrier）/ $200 USD 等值（AGL 或 SEND）',
    description: '使用 Amazon 合作承運商入倉抵用 £80；使用 Amazon Global Logistics（AGL）或跨境承運（SEND）抵用 $200 USD 等值',
    howToGet: [
      '在帳號註冊後 90 天內啟用 FBA',
      '透過 Seller Central 建立 FBA Shipment',
      '抵用會在第一批貨物入倉後發放，用於折抵未來費用',
    ],
    deadline: '註冊後 90 天內啟用 FBA',
    tips: [
      '⚠️ AGL 目前限「從中國發貨」的賣家，台灣出貨無法使用',
      '從台灣出貨：可選 Partnered Carrier（UK £80）或 SEND 跨境承運方案',
      '首批入倉建議少量測試，確認流程順暢再大量發貨',
    ],
    source: TW_SOURCE,
  },
  {
    id: 'fba-new-selection',
    title: 'FBA 新品免倉儲費 + 退貨處理免費',
    category: 'fba',
    value: '免費倉儲 + 免費移除 + 免費退貨處理',
    description: '自動加入 FBA New Selection 計畫，新上架的 FBA 商品享有免費月倉儲費、免費移除和退貨處理',
    howToGet: [
      '啟用 FBA 後自動加入',
      '適用於首次使用 FBA 的 ASIN',
    ],
    deadline: '首次 FBA 入倉後 365 天內',
    tips: [
      '這段期間可以大膽測試更多品項，不用擔心倉儲費',
      '365 天內也豁免低庫存量費（Low-Inventory-Level Fee）',
    ],
    source: TW_SOURCE,
  },
  {
    id: 'fba-storage-exempt',
    title: '倉儲利用率附加費豁免',
    category: 'fba',
    value: '首年免收',
    description: '新賣家首次 FBA 入倉後 365 天內，豁免倉儲利用率附加費（Storage Utilisation Surcharge）',
    howToGet: ['啟用 FBA 後自動適用'],
    deadline: '首次入倉後 365 天',
    source: TW_SOURCE,
  },
  {
    id: 'fba-39w-no-cap',
    title: '39 週不限庫容',
    category: 'fba',
    value: '39 週',
    description: '新賣家入駐 39 週內不受 FBA 庫存容量限制（IPI 評分 / Restock Limit）束縛',
    howToGet: [
      '完成 FBA 啟用後自動適用',
    ],
    deadline: '首次入倉後 39 週',
    tips: [
      '對新品爬坡期非常重要：可以一次多備貨，不用擔心被限制入倉量',
      '39 週後會回到一般的 IPI 評分機制',
    ],
    source: TW_SOURCE,
  },
  {
    id: 'fba-new-asin-rebate',
    title: '新父 ASIN 100 件，配送費回饋',
    category: 'fba',
    value: '北美/歐洲/新興站點 ~10% / 日本 ~5%',
    description: '新父 ASIN 最多 100 件商品享受銷售額回饋，可抵扣 FBA 配送費；同時免月倉儲費、批量清貨費、Vine 註冊費、退貨處理費',
    howToGet: [
      '啟用 FBA 後對「新父 ASIN」自動套用',
      '回饋以平均比例自動抵扣配送費',
    ],
    deadline: '視 SKU 上架時間而定',
    tips: [
      '⚠️ 新品銷售額回饋**不與**品牌銷售額回饋疊加（兩者擇優適用）',
      '對測試新品線特別友善：銷售前 100 件就能拿到配送費抵扣',
    ],
    source: TW_SOURCE,
  },
  {
    id: 'low-price-fba-eu',
    title: '歐洲 Low-Price FBA 適用 ≤£20/€20',
    category: 'fba',
    value: '單件平均省 £0.40/€0.45',
    description: '歐洲 Low-Price FBA 適用範圍涵蓋 ≤£20/€20 的低價商品，享優惠配送費率',
    howToGet: [
      '商品售價 ≤ £20/€20 且符合 Low-Price FBA 規格',
      '自動套用，無需另外申請',
    ],
    deadline: '常態方案，無到期日',
    tips: [
      '低客單價商品（如配件、小件家居）特別適用',
      '搭配 Coupons 與 Sponsored Products 可進一步提升轉換',
    ],
    source: EUFEE_SOURCE,
  },
  {
    id: 'ads-credits',
    title: 'Sponsored Products 廣告券',
    category: 'ads',
    value: '$1,000 USD 等值（UK £750）',
    description: '免費的商品推廣廣告額度，用於啟動 Sponsored Products 廣告活動',
    howToGet: [
      '在帳號註冊後 90 天內建立第一個 Sponsored Products 廣告活動',
      '依廣告花費階梯領取（花 $50 拿 $50 / 花 $200 拿 $200 / 花 $1,000 拿 $1,000）',
      '額度發放後自動套用於後續廣告費用',
    ],
    deadline: '註冊後 90 天內啟動廣告，額度發放後 30 天內未用即過期',
    tips: [
      '建議搭配自動投放 + 手動投放雙管齊下',
      '先用自動投放跑 2 週收集數據，再轉手動精準投放',
      '⚠️ 廣告券過期較快（30 天），啟用前先把 listing 準備到位再開廣告',
    ],
    source: TW_SOURCE,
  },
  {
    id: 'coupon-credits',
    title: '優惠券（Coupons）額度',
    category: 'tools',
    value: '$50 USD 等值（UK £40）',
    description: '免費建立 Amazon 優惠券，吸引買家點擊和購買',
    howToGet: [
      '在 Seller Central 的促銷工具中建立優惠券',
      '額度自動套用於 Coupon 變動費用',
    ],
    deadline: '註冊後 12 個月內',
    tips: [
      '優惠券會在搜尋結果中顯示綠色標籤，提升點擊率',
      '建議設定 5-15% 的折扣幅度，兼顧吸引力和利潤',
      '⚠️ 2025/6/2 - 2026/3/12 期間建立的 Coupons 因系統升級無法使用 NSI 抵扣（Amazon 會月度自動補償）',
    ],
    source: TW_SOURCE,
  },
  {
    id: 'eu-deals-cap',
    title: '歐洲限時促銷/秒殺費用上限',
    category: 'tools',
    value: 'UK £200 / DE €300 / FR/IT/ES €100',
    description: 'Best Deals 與 Lightning Deals 的變動費用設有上限，上促銷活動成本可控',
    howToGet: [
      '進入符合資格的 Deals 後自動套用上限',
    ],
    deadline: '常態方案',
    tips: [
      '搭配廣告券和 Coupon 使用，新品衝量期效果更好',
      '配合 11 月 Black Friday、7 月 Prime Day 規劃促銷',
    ],
    source: EUFEE_SOURCE,
  },
  {
    id: 'b2b-fba-discount',
    title: '企業購（B2B）FBA 一單多件費用減免',
    category: 'b2b',
    value: '最高省 24%',
    description: '企業買家下大訂單（一單多件）時，FBA 配送費可減免，提升 B2B 通路毛利',
    howToGet: [
      'Seller Central 啟用 Amazon Business（企業購）',
      '商品自動對企業買家曝光',
    ],
    deadline: '常態方案',
    tips: [
      'B2B 訂單客單價高、退貨率低，是穩定營收來源',
      '配合企業購廣告位讓品牌進入採購名單',
    ],
    source: TW_SOURCE,
  },
  {
    id: 'b2b-bulk-referral',
    title: '企業購（B2B）大額訂單佣金優惠',
    category: 'b2b',
    value: '佣金低至 5% / 大包裝佣金折扣最高 25%',
    description: '針對企業買家的大額訂單與大包裝商品，提供佣金折扣',
    howToGet: [
      'Seller Central 啟用 Amazon Business',
      '定義 B2B 專屬價格與大包裝商品',
    ],
    deadline: '常態方案',
    source: TW_SOURCE,
  },
  {
    id: 'eu-emerging-stores',
    title: '歐洲新興站點返利（NL/BE/SE/IE/PL）',
    category: 'brand',
    value: '$52,500 USD 等值抵用券',
    description: '針對歐盟新興站點（荷蘭、比利時、瑞典、愛爾蘭、波蘭）提供額外的品牌銷售返利方案',
    howToGet: [
      '前 5 萬美元銷售給 10% 抵扣',
      '之後給 5% 抵扣',
      '與主要 EU4 / UK 福利分開計算',
    ],
    deadline: '視該站點正式開放賣家入駐後計算',
    tips: [
      '台灣賣家目前可透過亞馬遜銷售到歐洲 10 國（含 NL/BE/SE/IE/PL）',
      '新興站點競爭較少，是測試新品和擴張品牌的好選擇',
    ],
    source: TW_SOURCE,
  },
];

const categoryInfo: Record<string, { label: string; icon: string; color: string }> = {
  brand: { label: '品牌註冊福利', icon: '🏷️', color: 'bg-purple-50 border-purple-200' },
  fba: { label: 'FBA 物流福利', icon: '📦', color: 'bg-blue-50 border-blue-200' },
  ads: { label: '廣告推廣福利', icon: '📢', color: 'bg-orange-50 border-orange-200' },
  tools: { label: '促銷工具福利', icon: '🛠️', color: 'bg-green-50 border-green-200' },
  b2b: { label: '企業購（B2B）福利', icon: '🏢', color: 'bg-cyan-50 border-cyan-200' },
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
            <p className="text-white/70 text-sm">EU4 / UK Split 後，兩區可分別領取一次完整福利</p>
          </div>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          Amazon 為新進賣家提供一系列啟動資源，涵蓋品牌返利、物流優惠、廣告額度、促銷工具與企業購福利。
          EU4（DE/FR/IT/ES）與 UK 已拆分計算，總額相加最高可達約 $100,000 USD 等值。
        </p>
        <p className="text-xs text-white/60 mt-3">
          📌 資料來源：
          <a href="https://gs.amazon.com.tw/news/2026-why-you-need-to-sell-on-amazon-260209" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Amazon Taiwan 官方公告</a>
          ｜
          <a href="https://sell.amazon.co.uk/sell-online" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">sell.amazon.co.uk</a>
          ｜
          <a href="https://www.channelmax.net/article/amazon-speeds-up-new-brand-bonus-payouts-for-uk-sellers-splits-uk-and-eu-incentives-channelmax" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">ChannelMAX 報導</a>
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center border-t-4 border-purple-400">
          <div className="text-base sm:text-lg font-bold text-purple-700">$52,500 USD</div>
          <div className="text-xs text-gray-500">品牌返利上限（單區）</div>
          <div className="text-[10px] text-gray-400 mt-0.5">UK £42K / EU4 €47.25K</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center border-t-4 border-blue-400">
          <div className="text-base sm:text-lg font-bold text-blue-700">$200+ USD</div>
          <div className="text-xs text-gray-500">FBA 物流抵用</div>
          <div className="text-[10px] text-gray-400 mt-0.5">+ 365 天免倉儲費</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center border-t-4 border-orange-400">
          <div className="text-base sm:text-lg font-bold text-orange-700">$1,000 USD</div>
          <div className="text-xs text-gray-500">廣告券</div>
          <div className="text-[10px] text-gray-400 mt-0.5">UK £750 等值</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center border-t-4 border-green-400">
          <div className="text-base sm:text-lg font-bold text-green-700">$250+ USD</div>
          <div className="text-xs text-gray-500">Vine + Coupon</div>
          <div className="text-[10px] text-gray-400 mt-0.5">$200 + $50</div>
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
            <span>完成品牌註冊（含 IP Accelerator 申請中），解鎖 10%/5% 返利</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <span className="w-16 sm:w-20 text-right font-mono font-bold text-cyan-600 flex-shrink-0 text-xs sm:text-sm">39 週</span>
            <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0" />
            <span>FBA 不限庫容期結束，回到一般 IPI 評分機制</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <span className="w-16 sm:w-20 text-right font-mono font-bold text-green-600 flex-shrink-0 text-xs sm:text-sm">12 個月</span>
            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
            <span>所有優惠到期，未使用的額度將失效</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
          📌 撥款週期：UK 站 2026/3/26 起，符合資格後 7 天內發放抵用額（取代過去的次月撥款）
        </p>
      </div>

      {/* 90-day strategy */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="font-bold text-amber-800 mb-2">💡 90 天加速策略</h3>
        <p className="text-sm text-amber-700 mb-3">
          數據顯示：入駐首 90 天內完成《新賣家入門指南》的賣家，首年銷售額平均高出一般賣家 9 倍。
          <a href="https://sell.amazon.co.uk/sell-online" target="_blank" rel="noopener noreferrer" className="underline ml-1 text-amber-800">（資料來源：sell.amazon.co.uk）</a>
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
                      <div className="mt-2 flex flex-wrap gap-2 items-center">
                        <span className="text-xs px-2 py-1 bg-white/80 text-gray-600 rounded">
                          ⏱ 期限：{item.deadline}
                        </span>
                        {item.source && (
                          <a
                            href={item.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2 py-1 bg-white/80 text-blue-600 rounded hover:bg-blue-50 hover:underline transition"
                          >
                            🔗 {item.source.label}
                          </a>
                        )}
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

      {/* NSI Dashboard 連結 */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 mb-6">
        <h3 className="font-bold text-amazon-dark mb-2">🔍 查看你的個人 NSI 福利</h3>
        <p className="text-sm text-gray-600 mb-3">
          每個帳號實際符合資格的福利可能不同。登入 Seller Central 後可以查看個人化的福利清單與額度狀態。
        </p>
        <a
          href={NSI_DASHBOARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amazon-orange text-white text-sm font-medium rounded-lg hover:bg-orange-500 transition"
        >
          📊 前往 Seller Central NSI Dashboard →
        </a>
      </div>

      {/* Cost info */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
        <h3 className="font-bold text-amazon-dark mb-2">💰 開店成本</h3>
        <p className="text-sm text-gray-600">
          專業賣家方案月費 $39.99 美元（UK £25 / 月，未稅），一個帳號可同時經營 18 大海外站點，
          月費不重複計算。搭配新賣家大禮包的各項優惠，首年實際營運成本可大幅降低。
        </p>
        <p className="text-xs text-gray-400 mt-3">
          資料來源：
          <a href="https://gs.amazon.com.tw/news/2026-why-you-need-to-sell-on-amazon-260209" target="_blank" rel="noopener noreferrer" className="underline">Amazon Taiwan 官方公告</a>
          ｜
          <a href="https://sell.amazon.co.uk/sell-online" target="_blank" rel="noopener noreferrer" className="underline">sell.amazon.co.uk</a>
          。實際金額以 Seller Central 顯示為準（USD ↔ EUR ↔ GBP 為內部統一換算基準）。
        </p>
      </div>

      {/* EU4/UK Split notice */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-bold text-blue-800 mb-2">📢 重要變更：EU4 / UK 分拆計算</h3>
        <p className="text-sm text-blue-700 leading-relaxed">
          原本歐洲五國（EU5）的新賣家激勵方案，已拆分為 <span className="font-semibold">EU4（德國、法國、義大利、西班牙）</span> 和 <span className="font-semibold">UK（英國）</span> 兩個獨立區域分別計算。
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="font-semibold text-blue-800 text-sm mb-1">EU4 站點</div>
            <p className="text-xs text-gray-600">DE/FR/IT/ES 共享一組額度</p>
            <div className="text-sm font-bold text-blue-700 mt-1">€47,250 主返利</div>
            <div className="text-[10px] text-gray-500">+ Vine $200 / 廣告 $1,000 / Coupon $50（USD 等值）</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="font-semibold text-blue-800 text-sm mb-1">UK 站點</div>
            <p className="text-xs text-gray-600">英國獨立為一個區域</p>
            <div className="text-sm font-bold text-blue-700 mt-1">£42,000 主返利</div>
            <div className="text-[10px] text-gray-500">+ Vine £160 / 廣告 £750 / Coupon £40</div>
          </div>
        </div>
        <p className="text-sm text-blue-700 mt-3">
          ✅ 符合資格的賣家可以<span className="font-semibold">分別在 EU4 和 UK 各領取一次完整的新賣家大禮包</span>，等於激勵總額相加 ≈ $100,000 USD 等值。
        </p>
        <p className="text-xs text-gray-400 mt-2">
          資料來源：
          <a href="https://www.channelmax.net/article/amazon-speeds-up-new-brand-bonus-payouts-for-uk-sellers-splits-uk-and-eu-incentives-channelmax" target="_blank" rel="noopener noreferrer" className="underline">ChannelMAX 2026/04 報導</a>
          ｜
          <a href="https://sell.amazon.co.uk/sell-online" target="_blank" rel="noopener noreferrer" className="underline">sell.amazon.co.uk 官方頁</a>
          。實際適用條件以 Seller Central NSI Dashboard 公告為準。
        </p>
      </div>
    </div>
  );
}
