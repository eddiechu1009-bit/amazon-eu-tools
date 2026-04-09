import { useState, useCallback, useMemo } from 'react';
import { TransactionRow, AccountingSummary, FeeCategory } from '../data/accountingTypes';
import { parseSettlementCSV, summarizeTransactions } from '../data/csvParser';
import {
  feeCategories,
  feeCategoryMap,
  feeExplainers,
  matchExplainer,
  getExplainersByCategory,
} from '../data/accountingData';

type ViewMode = 'upload' | 'summary' | 'detail' | 'glossary';

export default function AccountingAnalyzer() {
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [summary, setSummary] = useState<AccountingSummary | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const [selectedCategory, setSelectedCategory] = useState<FeeCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFile = useCallback((file: File) => {
    setError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseSettlementCSV(text);
        if (parsed.length === 0) {
          setError('無法解析檔案，請確認是 Amazon Settlement Report 的 CSV/TSV 格式。');
          return;
        }
        setRows(parsed);
        setSummary(summarizeTransactions(parsed));
        setViewMode('summary');
      } catch {
        setError('檔案解析失敗，請確認格式正確。');
      }
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const resetAll = () => {
    setRows([]);
    setSummary(null);
    setViewMode('upload');
    setFileName('');
    setError('');
    setSelectedCategory(null);
  };

  // ─── 上傳畫面 ───────────────────────────────────────────
  if (viewMode === 'upload') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-amazon-dark mb-2">📊 帳務分析工具</h2>
          <p className="text-gray-500">
            上傳 Amazon Seller Central 的 Settlement Report（CSV / TSV），自動分類科目並產出彙總
          </p>
        </div>

        {/* 拖放區 */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer
            ${dragOver ? 'border-amazon-orange bg-orange-50' : 'border-gray-300 hover:border-amazon-orange hover:bg-orange-50/30'}`}
        >
          <div className="text-5xl mb-4">📁</div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            將 Settlement Report 檔案拖放至此
          </p>
          <p className="text-sm text-gray-400 mb-4">支援 .csv / .tsv / .txt 格式</p>
          <label className="inline-block px-6 py-2 bg-amazon-orange text-white rounded-lg cursor-pointer hover:bg-orange-500 transition">
            或點此選擇檔案
            <input type="file" accept=".csv,.tsv,.txt" onChange={onFileInput} className="hidden" />
          </label>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* 下載說明 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-blue-800 mb-2">📥 如何下載 Settlement Report？</h3>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>登入 Amazon Seller Central</li>
            <li>前往 Reports → Payments → Settlement</li>
            <li>選擇結算週期，點擊 Download → Flat File V2</li>
            <li>將下載的檔案上傳至此工具</li>
          </ol>
        </div>

        {/* 科目字典入口 */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setViewMode('glossary')}
            className="text-sm text-amazon-orange hover:underline"
          >
            📖 不上傳檔案，直接查看科目中英對照字典 →
          </button>
        </div>
      </div>
    );
  }

  // ─── 科目字典 ───────────────────────────────────────────
  if (viewMode === 'glossary') {
    return (
      <GlossaryView
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onBack={() => { setViewMode(summary ? 'summary' : 'upload'); setSelectedCategory(null); }}
      />
    );
  }

  if (!summary) return null;

  // ─── 彙總畫面 ───────────────────────────────────────────
  if (viewMode === 'summary') {
    return (
      <SummaryView
        summary={summary}
        fileName={fileName}
        onReset={resetAll}
        onViewDetail={(cat) => { setSelectedCategory(cat); setViewMode('detail'); }}
        onViewGlossary={() => setViewMode('glossary')}
      />
    );
  }

  // ─── 分類明細 ───────────────────────────────────────────
  if (viewMode === 'detail' && selectedCategory) {
    return (
      <DetailView
        rows={rows}
        category={selectedCategory}
        onBack={() => { setViewMode('summary'); setSelectedCategory(null); }}
      />
    );
  }

  return null;
}


// ═══════════════════════════════════════════════════════════════
// 子元件：彙總畫面
// ═══════════════════════════════════════════════════════════════

function SummaryView({
  summary,
  fileName,
  onReset,
  onViewDetail,
  onViewGlossary,
}: {
  summary: AccountingSummary;
  fileName: string;
  onReset: () => void;
  onViewDetail: (cat: FeeCategory) => void;
  onViewGlossary: () => void;
}) {
  const maxAbs = Math.max(
    ...Object.values(summary.byCategory).map(Math.abs),
    1
  );

  return (
    <div>
      {/* 頂部操作列 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-amazon-dark">📊 帳務彙總</h2>
          <p className="text-sm text-gray-400">
            {fileName} · {summary.rowCount} 筆交易 · {summary.currency}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onViewGlossary}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            📖 科目字典
          </button>
          <button
            onClick={onReset}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            🔄 重新上傳
          </button>
        </div>
      </div>

      {/* 淨額卡片 */}
      <div className={`rounded-xl p-6 mb-6 text-center ${summary.netProceeds >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <p className="text-sm text-gray-500 mb-1">本期淨撥款 Net Proceeds</p>
        <p className={`text-3xl font-bold ${summary.netProceeds >= 0 ? 'text-green-700' : 'text-red-700'}`}>
          {formatCurrency(summary.netProceeds, summary.currency)}
        </p>
      </div>

      {/* 分類卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {feeCategories.map((cat) => {
          const val = summary.byCategory[cat.id];
          if (val === 0) return null;
          const pct = Math.abs(val) / maxAbs;
          return (
            <button
              key={cat.id}
              onClick={() => onViewDetail(cat.id)}
              className="text-left p-4 bg-white rounded-xl border hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {cat.icon} {cat.label}
                </span>
                <span className={`font-bold ${val >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {formatCurrency(val, summary.currency)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${pct * 100}%`, backgroundColor: cat.color }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 group-hover:text-amazon-orange transition">
                點擊查看明細 →
              </p>
            </button>
          );
        })}
      </div>

      {/* 科目明細表 */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h3 className="font-semibold text-gray-700">📋 各科目金額明細</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 text-gray-500">科目</th>
                <th className="text-right px-4 py-2 text-gray-500">金額</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary.byItem)
                .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                .map(([label, val]) => (
                  <tr key={label} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-700">{label}</td>
                    <td className={`px-4 py-2 text-right font-mono ${val >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {formatCurrency(val, summary.currency)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// 子元件：分類明細
// ═══════════════════════════════════════════════════════════════

function DetailView({
  rows,
  category,
  onBack,
}: {
  rows: TransactionRow[];
  category: FeeCategory;
  onBack: () => void;
}) {
  const catInfo = feeCategoryMap[category];
  const catExplainers = getExplainersByCategory(category);

  // 篩選該分類的交易
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const exp = matchExplainer(r.amountDescription);
      if (exp) return exp.category === category;
      return false;
    });
  }, [rows, category]);

  // 按科目分組小計
  const grouped = useMemo(() => {
    const map: Record<string, { label: string; total: number; count: number }> = {};
    for (const r of filtered) {
      const exp = matchExplainer(r.amountDescription);
      const key = exp?.label ?? r.amountDescription;
      if (!map[key]) map[key] = { label: key, total: 0, count: 0 };
      map[key].total += r.amount;
      map[key].count++;
    }
    return Object.values(map).sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
  }, [filtered]);

  const total = filtered.reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-amazon-orange mb-4 transition">
        ← 返回彙總
      </button>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{catInfo.icon}</span>
        <div>
          <h2 className="text-xl font-bold text-amazon-dark">{catInfo.label}</h2>
          <p className="text-sm text-gray-500">{catInfo.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">分類小計</span>
          <span className={`text-xl font-bold ${total >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {formatCurrency(total, filtered[0]?.currency ?? 'EUR')}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{filtered.length} 筆交易</p>
      </div>

      {/* 科目分組小計 */}
      <div className="space-y-2 mb-6">
        {grouped.map((g) => (
          <div key={g.label} className="bg-white rounded-lg border p-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-700">{g.label}</span>
              <span className="text-xs text-gray-400 ml-2">({g.count} 筆)</span>
            </div>
            <span className={`font-mono text-sm ${g.total >= 0 ? 'text-green-700' : 'text-red-600'}`}>
              {formatCurrency(g.total, filtered[0]?.currency ?? 'EUR')}
            </span>
          </div>
        ))}
      </div>

      {/* 科目說明 */}
      {catExplainers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-3">📖 此分類科目說明</h3>
          <div className="space-y-3">
            {catExplainers.map((exp) => (
              <div key={exp.key} className="text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded shrink-0">
                    {exp.key}
                  </span>
                  <span className="font-medium text-gray-800">{exp.label}</span>
                </div>
                <p className="text-gray-600 mt-0.5 ml-0">{exp.description}</p>
                {exp.formula && (
                  <p className="text-xs text-blue-600 mt-0.5">💡 計費：{exp.formula}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// 子元件：科目字典
// ═══════════════════════════════════════════════════════════════

function GlossaryView({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onBack,
}: {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selectedCategory: FeeCategory | null;
  setSelectedCategory: (c: FeeCategory | null) => void;
  onBack: () => void;
}) {
  const filtered = useMemo(() => {
    let items = feeExplainers;
    if (selectedCategory) {
      items = items.filter((f) => f.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      items = items.filter(
        (f) =>
          f.key.toLowerCase().includes(q) ||
          f.label.includes(q) ||
          f.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [searchTerm, selectedCategory]);

  return (
    <div>
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-amazon-orange mb-4 transition">
        ← 返回
      </button>

      <h2 className="text-xl font-bold text-amazon-dark mb-1">📖 帳務科目中英對照字典</h2>
      <p className="text-sm text-gray-500 mb-4">
        Amazon Settlement Report 所有科目的中英文說明與計費邏輯
      </p>

      {/* 搜尋 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜尋科目（中文 / 英文 / 關鍵字）..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange/50"
        />
      </div>

      {/* 分類篩選 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 text-xs rounded-full border transition ${
            !selectedCategory ? 'bg-amazon-orange text-white border-amazon-orange' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          全部
        </button>
        {feeCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              selectedCategory === cat.id
                ? 'text-white border-transparent'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            style={selectedCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
          >
            {cat.icon} {cat.label.split(' ')[0]}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-3">共 {filtered.length} 個科目</p>

      {/* 科目列表 */}
      <div className="space-y-3">
        {filtered.map((exp) => {
          const cat = feeCategoryMap[exp.category];
          return (
            <div key={exp.key} className="bg-white rounded-xl border p-4 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {exp.key}
                  </span>
                  <span className="font-semibold text-gray-800">{exp.label}</span>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full text-white shrink-0"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.icon} {cat.label.split(' ')[0]}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
              {exp.formula && (
                <p className="text-xs text-blue-600 mt-1">💡 計費邏輯：{exp.formula}</p>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">🔍</div>
          <p>找不到符合的科目</p>
        </div>
      )}
    </div>
  );
}

// ─── 工具函式 ─────────────────────────────────────────────────

function formatCurrency(val: number, currency: string): string {
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : currency + ' ';
  const sign = val < 0 ? '-' : '';
  return `${sign}${symbol}${Math.abs(val).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
