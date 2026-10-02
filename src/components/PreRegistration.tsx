import { useState, useEffect, useCallback } from 'react';
import { complianceItems } from '../data/compliance';
import { buildProductCertItems, lowerBound } from '../data/certItems';
import { countries as countryData } from '../data/countries';
import { CountryCode } from '../data/types';

interface Props {
  countries: CountryCode[];
  selectedCategories?: string[];
}

const PREREG_STORAGE_KEY = 'eu-tools-prereg-checked';

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(PREREG_STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

function saveChecked(checked: Set<string>) {
  localStorage.setItem(PREREG_STORAGE_KEY, JSON.stringify([...checked]));
}

const categoryLabels: Record<string, { label: string; icon: string }> = {
  tax: { label: '稅務', icon: '💰' },
  safety: { label: '產品安全', icon: '✅' },
  environment: { label: '環保法規', icon: '♻️' },
  registration: { label: '註冊與通關', icon: '📋' },
  productCert: { label: '產品安規認證（依品類）', icon: '🔍' },
  sustainability: { label: '中長期永續法規（提前準備）', icon: '🌱' },
};

const difficultyLabel = (d: number) => ['', '簡單', '普通', '中等', '較難', '困難'][d] || '';
const difficultyColor = (d: number) => ['', 'bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-yellow-100 text-yellow-700', 'bg-orange-100 text-orange-700', 'bg-red-100 text-red-700'][d] || '';

export default function PreRegistration({ countries: selectedCountries, selectedCategories = [] }: Props) {
  const [fbaCountries, setFbaCountries] = useState<CountryCode[]>([]);
  const [checked, setChecked] = useState<Set<string>>(loadChecked);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { saveChecked(checked); }, [checked]);

  const toggleFba = (code: CountryCode) => {
    setFbaCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Filter compliance items by selected countries
  const allCountries = [...new Set([...selectedCountries, ...fbaCountries])];
  const relevantItems = complianceItems.filter((item) =>
    item.countries.some((c) => allCountries.includes(c))
  );

  // 產品認證待辦（同名去重；EU＋UK 共用測試文件時 GB 項不重複計測試費）
  const productCertItems = buildProductCertItems(selectedCategories, allCountries);

  // Combine all items
  const allItems = [...relevantItems, ...productCertItems];

  // Group by category
  const grouped = allItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof allItems>);

  const totalItems = allItems.length;
  const checkedCount = allItems.filter((i) => checked.has(i.id)).length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  // ── 費用估算 ────────────────────────────────────────────────
  // 各項 cost 字串已統一為美元（例 '$330-880/年'、'$1,500-64,000'），取區間下界。
  // replace(/,/g) 而非 replace(',')：'$1,500-64,000' 有兩個逗號，只換第一個會算錯。

  // 拆成「一次性」與「年度」兩筆，不再混加成一個大數字 ——
  // 一次性的產品認證做一次就好，跟每年要繳的 VAT／代理費性質完全不同，
  // 相加會得出一個既不精確又嚇人的金額。
  // 判定方式：cost 字串含「/年」者為年度費用，其餘視為一次性。
  //
  // 已勾選（表示已完成／工廠端已有）的項目一律不計入 —— 多數賣家在其他市場
  // 已取得 CE／REACH／測試報告，那些是「待確認」而非「待支出」。
  const costOf = (predicate: (item: (typeof allItems)[number]) => boolean) =>
    allItems.reduce((acc, item) => {
      if (!item.mandatory) return acc;      // 「視品類」選用項不墊高估算
      if (checked.has(item.id)) return acc; // 已完成的不再計入
      if (!predicate(item)) return acc;
      return acc + lowerBound(item.cost);
    }, 0);

  const isRecurring = (cost: string) => cost.includes('/年');
  const recurringCosts = costOf((i) => isRecurring(i.cost));
  const oneOffCosts = costOf((i) => !isRecurring(i.cost));
  const remainingMandatory = allItems.filter((i) => i.mandatory && !checked.has(i.id)).length;

  return (
    <div>
      {/* FBA Country Selection */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h3 className="font-bold text-amazon-dark mb-2">📦 FBA 入倉國家</h3>
        <p className="text-sm text-gray-500 mb-3">選擇你計畫使用 FBA 入倉的國家（可能需要額外的 VAT 註冊）</p>
        <div className="flex flex-wrap gap-2">
          {countryData.map((c) => (
            <button
              key={c.code}
              onClick={() => toggleFba(c.code)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm transition-all duration-200 ${
                fbaCountries.includes(c.code)
                  ? 'border-amazon-blue bg-blue-50 text-amazon-blue font-medium shadow-sm'
                  : selectedCountries.includes(c.code)
                  ? 'border-amazon-orange bg-orange-50 text-amazon-dark'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
              <span className="hidden sm:inline">
                {selectedCountries.includes(c.code) && <span className="text-xs text-gray-400">（已選站點）</span>}
                {fbaCountries.includes(c.code) && !selectedCountries.includes(c.code) && <span className="text-xs text-blue-400">FBA</span>}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center">
          <div className="text-xl sm:text-2xl font-bold text-amazon-dark">{totalItems}</div>
          <div className="text-xs text-gray-500">待辦項目</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{checkedCount}</div>
          <div className="text-xs text-gray-500">已完成</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center">
          <div className="text-xl sm:text-2xl font-bold text-amazon-orange">{progress}%</div>
          <div className="text-xs text-gray-500">完成率</div>
        </div>
      </div>

      {/*
        費用估算刻意分成「一次性」與「年度維持」兩欄：
        產品認證做一次就好，跟每年要繳的 VAT／代理費性質不同，混加會得出一個
        既不精確又讓人卻步的數字。並明確說明勾選已完成的項目會即時扣除 ——
        多數賣家在其他市場已有 CE／測試報告，那些屬於「待確認」而非「待支出」。
      */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-sm font-semibold text-amazon-dark">💰 費用估算（USD）</span>
          <span className="text-xs text-gray-400">尚有 {remainingMandatory} 項必要項未完成</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-lg sm:text-xl font-bold text-gray-700">
              ${oneOffCosts.toLocaleString()}<span className="text-sm font-normal text-gray-400"> 起</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">一次性（產品認證、測試報告）</div>
            <div className="text-[10px] text-gray-400 mt-1">工廠端若已有報告可直接沿用，勾掉即從估算扣除</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="text-lg sm:text-xl font-bold text-blue-700">
              ${recurringCosts.toLocaleString()}<span className="text-sm font-normal text-blue-400"> 起／年</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">年度維持（VAT、代理、保險）</div>
            <div className="text-[10px] text-gray-400 mt-1">多數項目可透過同一服務商整合報價</div>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
          以上取各項報價區間的下界加總，屬粗估。實際金額依認證機構、稅務代理與品類而異，
          常可透過整合服務商、共用測試報告等方式低於此估算。未含「視品類」的選用項目。
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-gradient-to-r from-amazon-orange to-yellow-400 h-2 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Grouped items */}
      {Object.entries(categoryLabels).map(([catKey, catInfo]) => {
        const items = grouped[catKey];
        if (!items || items.length === 0) return null;

        return (
          <div key={catKey} className="mb-6">
            <h3 className="text-lg font-bold text-amazon-dark mb-3 flex items-center gap-2">
              <span>{catInfo.icon}</span>
              {catInfo.label}
              <span className="text-sm font-normal text-gray-400">
                ({items.filter((i) => checked.has(i.id)).length}/{items.length})
              </span>
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border-2 transition-all duration-200 shadow-sm animate-fadeIn ${
                    checked.has(item.id) ? 'border-green-300 bg-green-50/30' : 'border-gray-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4">
                    <button
                      onClick={() => toggleCheck(item.id)}
                      className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        checked.has(item.id) ? 'bg-green-500 border-green-500 text-white animate-checkPop' : 'border-gray-300 hover:border-amazon-orange hover:scale-110'
                      }`}
                      aria-label={checked.has(item.id) ? '標記為未完成' : '標記為已完成'}
                    >
                      {checked.has(item.id) && <span className="text-sm">✓</span>}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold ${checked.has(item.id) ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                          {item.name}
                        </span>
                        {item.mandatory && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">必要</span>
                        )}
                        {!item.mandatory && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">視品類</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor(item.difficulty)}`}>
                          {difficultyLabel(item.difficulty)}
                        </span>
                        {/* Category color tags for productCert items */}
                        {'fromCategories' in item && (item as any).fromCategories && (
                          ((item as any).fromCategories as string[]).map((catName: string, ci: number) => {
                            const colors = [
                              'bg-indigo-100 text-indigo-700',
                              'bg-teal-100 text-teal-700',
                              'bg-pink-100 text-pink-700',
                              'bg-cyan-100 text-cyan-700',
                              'bg-violet-100 text-violet-700',
                              'bg-lime-100 text-lime-700',
                              'bg-rose-100 text-rose-700',
                              'bg-sky-100 text-sky-700',
                            ];
                            return (
                              <span key={ci} className={`text-xs px-2 py-0.5 rounded-full ${colors[ci % colors.length]}`}>
                                📦 {catName}
                              </span>
                            );
                          })
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      {/* Warning */}
                      {item.warning && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                          {item.warning}
                        </div>
                      )}
                      {/* Prerequisites */}
                      {item.prerequisites && item.prerequisites.length > 0 && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="text-xs font-semibold text-amber-700 mb-1">🔗 前置條件：</div>
                          <ul className="text-xs text-amber-600 space-y-0.5">
                            {item.prerequisites.map((pre, i) => (
                              <li key={i}>→ {pre}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">⏱ {item.timeline}</span>
                        <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">💰 {item.cost}</span>
                        <span className="text-xs px-2 py-1 bg-gray-50 rounded">
                          {item.countries.filter((c) => allCountries.includes(c)).map((c) => countryData.find((co) => co.code === c)?.flag).join(' ')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className="text-gray-400 hover:text-amazon-orange p-1.5 flex-shrink-0 rounded-lg hover:bg-orange-50 transition-all duration-200"
                    >
                      <span className={`inline-block transition-transform duration-200 ${expandedId === item.id ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                  </div>

                  {expandedId === item.id && (
                    <div className="px-3 sm:px-4 pb-4 ml-8 sm:ml-9 border-t border-gray-100 animate-fadeIn">
                      <div className="pt-3 space-y-3">
                        {item.documents && item.documents.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">📄 所需文件</h4>
                            {item.documents.map((doc, i) => (
                              <div key={i} className="text-sm bg-gray-50 rounded-lg p-2 mb-1">
                                <div className="font-medium text-gray-700">{doc.name}</div>
                                <div className="text-xs text-gray-500">{doc.description}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {item.tips && item.tips.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">💡 提示</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {item.tips.map((tip, i) => (
                                <li key={i} className="flex gap-1"><span className="text-gray-400">•</span>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {item.source && (
                          <div className="text-xs text-gray-400">📌 資料來源：{item.source}</div>
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
    </div>
  );
}
