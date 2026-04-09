import { useState, useEffect, useCallback } from 'react';
import { complianceItems } from '../data/compliance';
import { productCategories } from '../data/categories';
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

  // Build product certification items from selected categories, deduplicate by cert name
  const seenCertNames = new Set<string>();
  const productCertItems = selectedCategories.flatMap((catId) => {
    const cat = productCategories.find((c) => c.id === catId);
    if (!cat) return [];
    return cat.certifications
      .filter((cert) => cert.countries === 'all' || cert.countries.some((c) => allCountries.includes(c)))
      .filter((cert) => {
        // Deduplicate: skip if we already have a cert with the same name
        if (seenCertNames.has(cert.name)) return false;
        seenCertNames.add(cert.name);
        return true;
      })
      .map((cert) => {
        // Find all categories that share this cert
        const fromCategories = selectedCategories
          .map((cid) => productCategories.find((c) => c.id === cid))
          .filter((c) => c && c.certifications.some((cc) => cc.name === cert.name))
          .map((c) => c!.name);

        return {
          id: `cert-${catId}-${cert.name}`,
          name: `${cert.name}`,
          fullName: `${cert.name}`,
          description: cert.description,
          countries: (cert.countries === 'all' ? allCountries : cert.countries.filter((c) => allCountries.includes(c))) as CountryCode[],
          timeline: cert.timeline,
          cost: cert.cost,
          difficulty: cert.difficulty as 1 | 2 | 3 | 4 | 5,
          mandatory: cert.mandatory,
          category: 'productCert' as const,
          source: `歐盟官方法規`,
          warning: undefined as string | undefined,
          prerequisites: undefined as string[] | undefined,
          documents: undefined as undefined,
          tips: undefined as string[] | undefined,
          fromCategories,
        };
      });
  });

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

  // Cost estimation
  const estimatedCosts = allItems.reduce((acc, item) => {
    const match = item.cost.match(/[\d,]+/);
    if (match) acc += parseInt(match[0].replace(',', ''));
    return acc;
  }, 0);

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
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
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">€{estimatedCosts.toLocaleString()}+</div>
          <div className="text-xs text-gray-500">預估最低費用</div>
        </div>
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
