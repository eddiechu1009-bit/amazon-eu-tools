import { countries } from '../data/countries';
import { CountryCode } from '../data/types';

interface Props {
  selected: CountryCode[];
  onChange: (codes: CountryCode[]) => void;
  compact?: boolean;
}

export default function CountrySelector({ selected, onChange, compact }: Props) {
  const toggle = (code: CountryCode) => {
    onChange(
      selected.includes(code)
        ? selected.filter((c) => c !== code)
        : [...selected, code]
    );
  };

  if (compact) {
    return (
      <div className="flex gap-1">
        {countries.map((c) => (
          <button
            key={c.code}
            onClick={() => toggle(c.code)}
            className={`text-lg px-1 rounded transition ${
              selected.includes(c.code) ? 'opacity-100 bg-white/20' : 'opacity-40 hover:opacity-70'
            }`}
            title={c.name}
            aria-label={`${selected.includes(c.code) ? '取消選擇' : '選擇'} ${c.name}`}
          >
            {c.flag}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {countries.map((c) => (
        <button
          key={c.code}
          onClick={() => toggle(c.code)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
            selected.includes(c.code)
              ? 'border-amazon-orange bg-orange-50 text-amazon-dark shadow-md'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-sm'
          }`}
          aria-pressed={selected.includes(c.code)}
        >
          <span className="text-xl sm:text-2xl">{c.flag}</span>
          <div className="text-left">
            <div className="text-xs sm:text-sm font-semibold">{c.name}</div>
            <div className="text-xs text-gray-400 hidden sm:block">{c.nameEn}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
