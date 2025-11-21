import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onSearch, results, onSelect }) {
  const [value, setValue] = useState('');
  const wrapperRef = useRef(null); // 🔥 SearchBar 전체 ref
  const isScrollable = results.length >= 3;

  const clearInput = () => {
    setValue('');
    onSearch('');
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setValue(''); // 검색창 clear
        onSearch(''); // 결과 초기화
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] z-50"
    >
      <div
        className="
          bg-white rounded-2xl shadow-lg p-3 flex items-center gap-3 relative
          transition-all duration-200 ease-out
          focus-within:shadow-green-200 focus-within:scale-[1.03]
        "
      >
        <span className="text-gray-500 text-xl">🔍</span>

        <input
          type="text"
          placeholder="가게 이름을 검색하세요"
          value={value}
          onChange={(e) => {
            const keyword = e.target.value;
            setValue(keyword);
            onSearch(keyword);
          }}
          className="flex-1 text-sm outline-none bg-transparent"
        />

        {value.trim() !== '' && (
          <button
            onClick={clearInput}
            className="absolute right-4 text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        )}
      </div>

      {value.trim() !== '' && (
        <div
          className={`
            mt-2 bg-white rounded-xl shadow-lg p-2 text-sm 
            ${isScrollable ? 'max-h-32 overflow-y-auto' : ''}
          `}
        >
          {results.length === 0 ? (
            <div className="text-gray-500 text-center py-2">
              검색 결과가 없습니다
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="p-2 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
