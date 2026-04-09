import { useState } from 'react';
import { productCategories } from '../data/categories';
import { CountryCode } from '../data/types';
import { countries } from '../data/countries';

interface Props {
  countries: CountryCode[];
  selectedCategories?: string[];
  onCategoriesChange?: (ids: string[]) => void;
}

const difficultyStars = (d: number) => '★'.repeat(d) + '☆'.repeat(5 - d);
const difficultyColor = (d: number) => {
  const c = ['', 'text-green-600', 'text-blue-600', 'text-yellow-600', 'text-orange-600', 'text-red-600'];
  return c[d] || '';
};

export default function ComplianceChecker({ countries: selectedCountries, selectedCategories = [], onCategoriesChange }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategories[0] || '');

  const category = productCategories.find((c) => c.id === selectedCategory);

  const relevantCerts = category?.certifications.filter(
    (cert) => cert.countries === 'all' || cert.countries.some((c) => selectedCountries.includes(c))
  ) || [];

  // Common requirements for all categories
  const commonReqs = [
    { name: 'GPSR 授權代理人', countries: ['DE', 'FR', 'IT', 'ES'] as CountryCode[], desc: '歐盟境內授權代理人', cost: '€200-1,000/年' },
    { name: 'EPR 包裝註冊', countries: ['DE', 'FR', 'IT', 'ES', 'UK'] as CountryCode[], desc: '包裝回收責任註冊', cost: '€50-500/年/國' },
  ];

  return (
    <div>
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-amazon-dark mb-4">🔍 選擇你的商品品類</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? '' : cat.id)}
              className={`px-3 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                cat.id === selectedCategory
                  ? 'border-amazon-orange bg-orange-50 text-amazon-dark shadow-md'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5'
              }`}
            >
              <div>{cat.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{cat.nameEn}</div>
            </button>
          ))}
        </div>
      </div>

      {category && (
        <div className="space-y-6 animate-fadeIn">
          {/* Referral Fee */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-bold text-amazon-dark mb-3">💰 Amazon 佣金費率（Referral Fee）</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium">🇪🇺 歐盟站點（DE/FR/IT/ES）</div>
                <div className="text-xl font-bold text-blue-800 mt-1">{category.referralFeeEU}</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-sm text-indigo-600 font-medium">🇬🇧 英國站點（UK）</div>
                <div className="text-xl font-bold text-indigo-800 mt-1">{category.referralFeeUK}</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              資料來源：Amazon 2026 歐洲費率更新（2026年2月1日生效）。
              部分品類有低價商品優惠費率。
            </p>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-amazon-dark mb-3">✅ 安規認證要求</h3>
            {relevantCerts.length === 0 ? (
              <p className="text-gray-500 text-sm">此品類在你選擇的國家沒有特殊安規要求。</p>
            ) : (
              <div className="space-y-3">
                {relevantCerts.map((cert, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="font-semibold text-gray-800">{cert.name}</span>
                        {cert.mandatory && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">必要</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {(cert.countries === 'all' ? selectedCountries : cert.countries.filter(c => selectedCountries.includes(c))).map((c) => (
                          <span key={c} className="text-sm">{countries.find((co) => co.code === c)?.flag}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{cert.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">⏱ {cert.timeline}</span>
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">💰 {cert.cost}</span>
                      <span className={`text-xs px-2 py-1 bg-gray-50 rounded font-medium ${difficultyColor(cert.difficulty)}`}>
                        {difficultyStars(cert.difficulty)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Common requirements */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-amazon-dark mb-3">♻️ 通用環保與合規要求</h3>
            <div className="space-y-3">
              {commonReqs
                .filter((r) => r.countries.some((c) => selectedCountries.includes(c)))
                .map((req, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div>
                      <div className="font-medium text-sm text-gray-700">{req.name}</div>
                      <div className="text-xs text-gray-500">{req.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-700">{req.cost}</div>
                      <div className="flex gap-0.5 justify-end">
                        {req.countries.filter((c) => selectedCountries.includes(c)).map((c) => (
                          <span key={c} className="text-xs">{countries.find((co) => co.code === c)?.flag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {!category && (
        <div className="text-center py-16 text-gray-400 animate-fadeIn">
          <div className="text-5xl mb-4 opacity-50">🔍</div>
          <p className="text-base font-medium mb-1">請先選擇商品品類</p>
          <p className="text-sm">即可查看對應的安規認證和佣金費率</p>
        </div>
      )}
    </div>
  );
}
