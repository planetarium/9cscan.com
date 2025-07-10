interface ScoreBoardProps {
  loading: boolean;
  avgBlockTime: number;
  avgTx: number;
  WncgPrice: number;
  WncgMarketCap: number;
  WncgChange24h: number;
}

export default function ScoreBoard({
  loading,
  avgBlockTime,
  avgTx,
  WncgPrice,
  WncgMarketCap,
  WncgChange24h,
}: ScoreBoardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-bold text-gray-700 uppercase mb-3">WNCG Price</h5>
              <div className="text-left">
                {loading ? (
                  <div className="h-8 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <div className="text-2xl font-bold">
                    ${WncgPrice.toFixed(2)}
                    <span className="text-gray-500 text-sm font-normal ml-1">/WNCG</span>
                    <span
                      className={`text-sm font-normal ml-2 ${WncgChange24h < 0 ? 'text-red-500' : 'text-blue-500'}`}
                    >
                      ({WncgChange24h.toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-bold text-gray-700 uppercase mb-3">Market Cap</h5>
              <div className="text-left">
                {loading ? (
                  <div className="h-8 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <div className="text-2xl font-bold">
                    ${Number(WncgMarketCap.toFixed()).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div>
            <h5 className="text-sm font-bold text-gray-700 uppercase mb-3">Network Performance</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center sm:text-left">
                {loading ? (
                  <div className="flex justify-center sm:justify-start mb-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
                  </div>
                ) : (
                  <div className="text-2xl font-bold mb-1">{avgBlockTime.toFixed(2)}s</div>
                )}
                <span className="text-sm text-gray-600">Avg Block Time</span>
              </div>

              <div className="text-center sm:text-left">
                {loading ? (
                  <div className="flex justify-center sm:justify-start mb-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
                  </div>
                ) : (
                  <div className="text-2xl font-bold mb-1">{avgTx.toFixed(2)}</div>
                )}
                <span className="text-sm text-gray-600">Avg Tx Per Block</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-4 text-left sm:text-right lg:text-right">
              Average over the last 100 blocks.
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div>
            <h5 className="text-sm font-bold text-gray-700 uppercase mb-6">Transaction History</h5>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500 text-sm">Chart Component</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
