import { productCategories } from '../data/categories';

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
  compact?: boolean;
}

export default function CategorySelector({ selected, onChange, compact }: Props) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((c) => c !== id)
        : [...selected, id]
    );
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {productCategories
          .filter((c) => selected.includes(c.id))
          .map((c) => (
            <span key={c.id} className="text-xs px-2 py-0.5 bg-white/20 rounded text-white">
              {c.name}
            </span>
          ))}
        {selected.length === 0 && (
          <span className="text-xs text-gray-400">未選品類</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {productCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => toggle(cat.id)}
          className={`px-3 py-2 rounded-lg border-2 text-sm transition ${
            selected.includes(cat.id)
              ? 'border-amazon-orange bg-orange-50 text-amazon-dark font-medium shadow-sm'
              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
          }`}
          aria-pressed={selected.includes(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
