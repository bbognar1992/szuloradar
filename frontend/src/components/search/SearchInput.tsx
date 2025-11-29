'use client';

interface SearchInputProps {
  search: string;
  onSearchChange: (value: string) => void;
  focusedField: 'search' | 'city' | null;
  onFocusChange: (field: 'search' | 'city' | null) => void;
  cityInputRef: React.RefObject<HTMLInputElement>;
  dropdownRef: React.RefObject<HTMLDivElement>;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export default function SearchInput({
  search,
  onSearchChange,
  focusedField,
  onFocusChange,
  cityInputRef,
  dropdownRef,
  searchInputRef,
}: SearchInputProps) {

  return (
    <div
      className={`relative group transition-all duration-300 ease-in-out ${
        focusedField === 'search'
          ? 'flex-[1.5]'
          : focusedField === 'city'
          ? 'flex-[0.7]'
          : 'flex-1'
      } min-w-0`}
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <svg
          className={`w-5 h-5 transition-colors duration-200 ${
            focusedField === 'search' ? 'text-teal-500' : 'text-gray-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        ref={searchInputRef}
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => onFocusChange('search')}
        onBlur={() => {
          // Check where the focus is going
          setTimeout(() => {
            if (document.activeElement === cityInputRef.current) {
              onFocusChange('city');
            } else if (
              document.activeElement !== searchInputRef.current &&
              document.activeElement !== cityInputRef.current &&
              !dropdownRef.current?.contains(document.activeElement)
            ) {
              // Clicked outside both inputs, reset to equal width
              onFocusChange(null);
            }
          }, 200);
        }}
        placeholder="Keresés hely név alapján..."
        aria-label="Keresés"
        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-300 text-sm h-[46px]"
      />
    </div>
  );
}

