import { useState, useEffect, useRef } from 'react';

interface ActionsSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function ActionsSelect({ value, onChange }: ActionsSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchActionTypes = async () => {
      try {
        const response = await fetch('https://9cscan.com/all_action_type_ids.txt');
        const text = await response.text();
        const actionTypeIds = text.split('\n').filter(Boolean);
        setItems(actionTypeIds);
      } catch (error) {
        console.error('Failed to fetch action types:', error);
      }
    };

    fetchActionTypes();
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => {
        searchRef.current?.select();
      }, 100);
    }
  }, [isOpen]);

  const filteredItems = items
    .filter(item => item.toLowerCase().includes(search.toLowerCase()))
    .map(item => ({
      value: item,
      label: search ? item.replace(new RegExp(search, 'gi'), match => `<b>${match}</b>`) : item
    }));

  const handleSelect = (item: { value: string; label: string }) => {
    if (value !== item.value) {
      onChange(item.value);
    }
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    setSearch('');
  };

  const handleEnter = () => {
    if (filteredItems.length > 0) {
      handleSelect(filteredItems[0]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="menu-down-btn px-2 py-1 border border-gray-400 rounded bg-white text-gray-700 hover:bg-gray-50 flex items-center"
        style={{ 
          minHeight: '30px',
          padding: '4px 2px 4px 8px',
          minWidth: '0px',
          height: 'auto'
        }}
      >
        {value || 'All Actions'}
        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-20 min-w-[200px]">
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEnter();
                }
              }}
              placeholder="Search actions..."
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelect(item)}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                style={{ minHeight: '36px', color: '#333' }}
                dangerouslySetInnerHTML={{ __html: item.label }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
