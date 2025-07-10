import { useState, useEffect } from 'react';

interface ActionsSelectProps {
  value?: string;
  color?: string;
  onChange?: (value: string) => void;
}

interface ActionItem {
  value: string;
  label: string;
}

export default function ActionsSelect({ value, onChange }: ActionsSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchActionTypeIds = async () => {
      try {
        const response = await fetch('https://9cscan.com/all_action_type_ids.txt');
        const text = await response.text();
        const actionTypeIds = text.split('\n').filter(Boolean);
        setItems(actionTypeIds);
      } catch (error) {
        console.error('Failed to fetch action type IDs:', error);
      }
    };

    fetchActionTypeIds();
  }, []);

  const filteredItems: ActionItem[] = items
    .filter((item) => !search || item.toLowerCase().includes(search.toLowerCase()))
    .map((item) => ({
      value: item,
      label: search ? item.replace(new RegExp(search, 'gi'), (match) => `<b>${match}</b>`) : item,
    }));

  const handleSelect = (item: ActionItem) => {
    if (value !== item.value) {
      onChange?.(item.value);
    }
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    onChange?.('');
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (filteredItems.length > 0) {
        handleSelect(filteredItems[0]);
      }
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm">{value || 'All Actions'}</span>
        {value && (
          <button
            type="button"
            className="ml-2 text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search actions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.map((item, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                onClick={() => handleSelect(item)}
                dangerouslySetInnerHTML={{ __html: item.label }}
              />
            ))}
            {filteredItems.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No actions found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
