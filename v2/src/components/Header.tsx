import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useWNCG } from '@/hooks/useWNCG';
import { useGetBlocksQuery } from '@/graphql-mimir/generated/graphql';
import { formatTimeAgo } from '@/utils/commonUtils';

const navItems = [
  { name: 'Blocks', path: '/blocks' },
  { name: 'Transactions', path: '/transactions' },
];

export default function Header() {
  const location = useLocation();
  const { wncgData } = useWNCG();
  const { data: blocksData } = useGetBlocksQuery({
    variables: { skip: 0, take: 1 },
    pollInterval: 8 * 1000,
  });

  const latestBlockIndex = blocksData?.blocks?.items?.[0]?.object?.index || 0;
  const latestBlock = blocksData?.blocks?.items?.[0]?.object;

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-8 h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/full_logo.png" alt="logo" className="h-8" />
            <span className="font-bold text-sm ml-2 mt-2 opacity-80 tracking-wider">
              {import.meta.env.VITE_NETWORK_NAME || '9cscan'}
            </span>
          </Link>
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-bold font-sans hover:text-blue-600 transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      
      {location.pathname !== '/' && (
        <div className="search-section" style={{ height: '60px', position: 'relative', zIndex: 0, borderBottom: '1px solid #eee', backgroundColor: 'white', marginBottom: '0px' }}>
          <div className="max-w-[1440px] mx-auto px-8 py-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4" style={{ height: '60px' }}>
              <div className="hidden lg:block lg:flex-shrink-0">
                {latestBlockIndex > 0 && (
                  <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded text-xs font-medium" style={{ marginTop: '14px', fontWeight: 500, fontSize: '11px' }}>
                    <span className="text-gray-600 mr-2">
                      WNCG: ${wncgData.price.toFixed(2)}{' '}
                      <span className={wncgData.percentChange24h < 0 ? 'text-red-600' : 'text-blue-600'}>
                        ({wncgData.percentChange24h.toFixed(2)}%)
                      </span>
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600 ml-2">
                      Block: {latestBlockIndex}{' '}
                      {latestBlock && (
                        <span className="text-gray-500 font-normal" style={{ fontWeight: 400, color: '#777', fontSize: '0.95em' }}>
                          ({formatTimeAgo(latestBlock.timestamp)})
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex justify-end">
                <div className="search-form" style={{ width: '100%', maxWidth: '650px' }}>
                  <SearchBar />
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:hidden px-8 pb-4 mt-4">
            {latestBlockIndex > 0 && (
              <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded text-xs font-medium" style={{ fontWeight: 500, fontSize: '11px' }}>
                <span className="text-gray-600 mr-2">
                  WNCG: ${wncgData.price.toFixed(2)}{' '}
                  <span className={wncgData.percentChange24h < 0 ? 'text-red-600' : 'text-blue-600'}>
                    ({wncgData.percentChange24h.toFixed(2)}%)
                  </span>
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600 ml-2">
                  Block: {latestBlockIndex}{' '}
                  {latestBlock && (
                    <span className="text-gray-500 font-normal" style={{ fontWeight: 400, color: '#777', fontSize: '0.95em' }}>
                      ({formatTimeAgo(latestBlock.timestamp)})
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
