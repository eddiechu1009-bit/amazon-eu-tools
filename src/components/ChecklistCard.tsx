import { useState } from 'react';
import { ChecklistItem, CountryCode } from '../data/types';
import { countries } from '../data/countries';

interface Props {
  item: ChecklistItem;
  checked: boolean;
  onToggle: () => void;
  selectedCountries: CountryCode[];
}

const difficultyLabel = (d: number) => {
  const labels = ['', '簡單', '普通', '中等', '較難', '困難'];
  return labels[d] || '';
};

const difficultyColor = (d: number) => {
  const colors = ['', 'text-green-600', 'text-blue-600', 'text-yellow-600', 'text-orange-600', 'text-red-600'];
  return colors[d] || '';
};

export default function ChecklistCard({ item, checked, onToggle, selectedCountries }: Props) {
  const [expanded, setExpanded] = useState(false);

  const applicableCountries = item.countries === 'all'
    ? selectedCountries
    : item.countries.filter((c) => selectedCountries.includes(c));

  return (
    <div className={`bg-white rounded-xl border-2 transition-all duration-200 shadow-sm animate-fadeIn ${
      checked ? 'border-green-300 bg-green-50/30' : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
    }`}>
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            checked ? 'bg-green-500 border-green-500 text-white animate-checkPop' : 'border-gray-300 hover:border-amazon-orange hover:scale-110'
          }`}
          aria-label={checked ? '標記為未完成' : '標記為已完成'}
        >
          {checked && <span className="text-sm">✓</span>}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-semibold ${checked ? 'text-green-700 line-through' : 'text-gray-800'}`}>
              {item.title}
            </h3>
            {item.required && (
              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">必要</span>
            )}
            {!item.required && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">視品類而定</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{item.description}</p>

          {/* Warning banner */}
          {item.warning && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {item.warning}
            </div>
          )}

          {/* Prerequisites */}
          {item.prerequisites && item.prerequisites.length > 0 && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-xs font-semibold text-amber-700 mb-1">🔗 前置條件（需先完成）：</div>
              <ul className="text-xs text-amber-600 space-y-0.5">
                {item.prerequisites.map((pre, i) => (
                  <li key={i}>→ {pre}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick info badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {item.timeline && (
              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md">⏱ {item.timeline}</span>
            )}
            {item.cost && (
              <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md">💰 {item.cost}</span>
            )}
            {item.difficulty && (
              <span className={`text-xs px-2 py-1 bg-gray-50 rounded-md font-medium ${difficultyColor(item.difficulty)}`}>
                {'★'.repeat(item.difficulty)}{'☆'.repeat(5 - item.difficulty)} {difficultyLabel(item.difficulty)}
              </span>
            )}
            {/* Country flags */}
            <span className="text-xs px-2 py-1 bg-gray-50 rounded-md">
              {applicableCountries.map((c) => countries.find((co) => co.code === c)?.flag).join(' ')}
            </span>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-amazon-orange p-1.5 flex-shrink-0 rounded-lg hover:bg-orange-50 transition-all duration-200"
          aria-label={expanded ? '收合詳情' : '展開詳情'}
        >
          <span className={`inline-block transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>▼</span>
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 ml-9 border-t border-gray-100 mt-0 animate-fadeIn">
          <div className="pt-3 space-y-3">
            {/* Documents */}
            {item.documents && item.documents.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">📄 所需文件</h4>
                <div className="space-y-1">
                  {item.documents.map((doc, i) => (
                    <div key={i} className="text-sm bg-gray-50 rounded-lg p-2">
                      <div className="font-medium text-gray-700">{doc.name}</div>
                      <div className="text-xs text-gray-500">{doc.description}</div>
                      {doc.fields && (
                        <div className="text-xs text-gray-400 mt-1">
                          欄位：{doc.fields.join('、')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {item.tips && item.tips.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">💡 提示</h4>
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

            {/* Source */}
            {item.source && (
              <div className="text-xs text-gray-400">
                📌 資料來源：{item.source}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
