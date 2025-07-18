import { useState } from 'react';

interface PaginationProps {
  size: number;
  page?: number;
  total?: number;
  before?: string;
  canNext: boolean;
  canPrev: boolean;
  onGoFirst: () => void;
  onNext: () => void;
  onPrev: () => void;
  onUpdateSize: (size: number) => void;
}

export default function Pagination({
  size,
  page,
  total,
  before,
  canNext,
  canPrev,
  onGoFirst,
  onNext,
  onPrev,
  onUpdateSize,
}: PaginationProps) {
  const [showSizeMenu, setShowSizeMenu] = useState(false);

  const sizeOptions = [10, 20, 30, 50];

  return (
    <div className="pagination flex items-center mt-2 md:mt-0" style={{ position: 'relative', zIndex: 11, fontSize: '12px', color: '#777', fontWeight: 400 }}>
      <div className="flex w-full">
        <div className="py-0 flex items-center text-nowrap">
          <div className="hidden xs-only">
            <div className="relative">
              <button
                onClick={() => setShowSizeMenu(!showSizeMenu)}
                className="menu-down-btn px-2 py-1 border border-gray-400 rounded bg-white text-gray-700 hover:bg-gray-50"
                style={{ minHeight: '30px' }}
              >
                <span className="mr-1">Show</span> {size}
                <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showSizeMenu && (
                <div className="absolute top-full left-0 mt-1 bg-gray-100 border border-gray-300 rounded shadow-lg z-20">
                  {sizeOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        onUpdateSize(option);
                        setShowSizeMenu(false);
                      }}
                      className="block w-full px-3 py-1 text-left hover:bg-gray-200 text-sm font-medium"
                      style={{ minHeight: '28px', color: '#333' }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex py-1 items-center page-item text-nowrap justify-center flex-1" style={{ fontSize: '13px', fontWeight: 700 }}>
          <button
            onClick={onGoFirst}
            disabled={page === 1}
            className="p-1 rounded text-gray-700 border border-gray-400 bg-white disabled:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ minHeight: '30px' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden xs-only ml-1">first</span>
          </button>
          
          <button
            onClick={onPrev}
            disabled={!canPrev || page === 1}
            className="ml-2 p-1 rounded text-gray-700 border border-gray-400 bg-white disabled:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ minHeight: '30px' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className="mx-2">
            {page ? (
              <>
                {(1 + size * ((page || 1) - 1)).toLocaleString()} ~ {(size * (page || 1)).toLocaleString()}
                {total && <span> of {total.toLocaleString()}</span>}
              </>
            ) : (
              <>
                {before} ~
              </>
            )}
          </span>
          
          <button
            onClick={onNext}
            disabled={!canNext}
            className="p-1 rounded text-gray-700 border border-gray-400 bg-white disabled:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ minHeight: '30px' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 