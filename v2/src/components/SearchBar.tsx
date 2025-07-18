import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchKeyword } from '../utils/searchUtils';

export default function SearchBar() {
  const [searchKey, setSearchKey] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchKey.trim()) {
      searchKeyword(searchKey, navigate);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative max-w-2xl">
      <div className="relative">
        <input
          type="text"
          className="w-full bg-gray-100 rounded-xl text-gray-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
          style={{
            height: '46px',
            padding: '8px 16px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#F1F5F9',
          }}
          placeholder="Search by Block / Account Address / Tx Hash / Action Symbol"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="absolute right-0 top-0 text-white flex items-center justify-center transition-colors"
          style={{
            height: '46px',
            width: '40px',
            backgroundColor: '#2c1e65',
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px',
            border: 'none',
            marginRight: '-14px',
            overflow: 'hidden',
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 