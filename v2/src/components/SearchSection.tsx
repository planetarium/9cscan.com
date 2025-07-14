import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchKeyword } from '../utils/searchUtils';

export default function SearchSection() {
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
    <div className="relative h-70 bg-gradient-to-br from-purple-800 via-purple-600 to-blue-500 shadow-lg mb-0">
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-20"
        style={{ backgroundImage: "url('/grid.png')" }}
      />
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="md:w-2/3">
            <div className="search-form">
              <h2 className="text-white text-2xl font-bold mb-5 mt-4">
                The Nine Chronicles Blockchain Explorer
              </h2>
              <div className="mt-4">
                <div className="relative max-w-2xl">
                  <input
                    type="text"
                    className="w-full h-15 px-4 py-3 bg-white rounded-xl text-gray-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by Block / Account Address / Tx Hash / Action Symbol"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="absolute right-0 top-0 h-15 w-16 bg-blue-600 hover:bg-blue-700 text-white rounded-r-xl flex items-center justify-center transition-colors"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
