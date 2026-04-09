import { useState, useEffect, useCallback } from 'react';
import { wizardSteps } from '../data/wizardSteps';
import { CountryCode } from '../data/types';
import ChecklistCard from './ChecklistCard';

const WIZARD_STORAGE_KEY = 'eu-tools-wizard-checked';

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

function saveChecked(checked: Set<string>) {
  localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify([...checked]));
}

interface Props {
  countries: CountryCode[];
}

export default function WizardView({ countries }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(loadChecked);

  useEffect(() => { saveChecked(checked); }, [checked]);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const step = wizardSteps[currentStep];
  const relevantItems = step.items.filter(
    (item) => item.countries === 'all' || item.countries.some((c) => countries.includes(c))
  );

  const totalItems = wizardSteps.reduce((sum, s) => {
    return sum + s.items.filter(
      (item) => item.countries === 'all' || item.countries.some((c) => countries.includes(c))
    ).length;
  }, 0);
  const checkedCount = checked.size;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6 bg-white rounded-xl p-4 shadow-sm animate-fadeIn">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">整體進度</span>
          <span className="text-sm text-gray-500">{checkedCount}/{totalItems} 項完成 ({progress}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-amazon-orange to-yellow-400 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        {progress === 100 && (
          <p className="text-sm text-green-600 font-semibold mt-2 text-center animate-fadeInScale">
            🎉 所有步驟都已完成！
          </p>
        )}
      </div>

      {/* Step navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
        {wizardSteps.map((s, i) => {
          const stepItems = s.items.filter(
            (item) => item.countries === 'all' || item.countries.some((c) => countries.includes(c))
          );
          const stepChecked = stepItems.filter((item) => checked.has(item.id)).length;
          const allDone = stepItems.length > 0 && stepChecked === stepItems.length;

          return (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition border ${
                i === currentStep
                  ? 'bg-amazon-dark text-white border-amazon-dark'
                  : allDone
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="mr-1">{allDone ? '✅' : s.icon}</span>
              {s.title}
              <span className="ml-1 text-xs opacity-70">({stepChecked}/{stepItems.length})</span>
            </button>
          );
        })}
      </div>

      {/* Current step content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-amazon-dark flex items-center gap-2">
          <span className="text-2xl">{step.icon}</span>
          {step.title}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{step.description}</p>
      </div>

      <div className="space-y-4">
        {relevantItems.map((item) => (
          <ChecklistCard
            key={item.id}
            item={item}
            checked={checked.has(item.id)}
            onToggle={() => toggleCheck(item.id)}
            selectedCountries={countries}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8 gap-3">
        <button
          onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
          disabled={currentStep === 0}
          className="px-4 sm:px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50
            disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
        >
          ← 上一步
        </button>
        <button
          onClick={() => setCurrentStep((p) => Math.min(wizardSteps.length - 1, p + 1))}
          disabled={currentStep === wizardSteps.length - 1}
          className="px-4 sm:px-6 py-2 rounded-lg bg-amazon-orange text-white font-medium hover:bg-orange-500
            disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
        >
          下一步 →
        </button>
      </div>
    </div>
  );
}
