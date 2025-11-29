'use client';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { key: 'all', label: 'Összes' },
  { key: 'kávézó', label: '☕ Kávézó' },
  { key: 'étterem', label: '🍽️ Étterem' },
  { key: 'konditerem', label: '💪 Edzőterem' },
  { key: 'szállás', label: '🏨 Szállás' },
];

export default function FilterTabs({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <div className="filters-tabs flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 flex-wrap justify-center lg:justify-start">
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() => onFilterChange(filter.key)}
          className={`filter-tab px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
            activeFilter === filter.key
              ? 'bg-white text-teal-600 shadow-sm active'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

