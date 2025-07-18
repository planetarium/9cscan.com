import TxHistoryChart from './TxHistoryChart';
import LoadingSpinner from './common/LoadingSpinner';
import { formatNumber } from '@/utils/commonUtils';

interface Block {
  index: number;
  timestamp: string;
  txCount: number;
}

interface ScoreBoardProps {
  loading: boolean;
  blocks: Block[];
  WncgPrice: number;
  WncgMarketCap: number;
  WncgChange24h: number;
}

const calculateStats = (blocks: Block[]) => {
  if (!blocks || blocks.length < 2) return { avgBlockTime: 0, avgTx: 0 };

  const sortedBlocks = [...blocks].sort((a, b) => a.index - b.index);

  let totalBlockTime = 0;
  let totalTx = 0;

  for (let i = 1; i < sortedBlocks.length; i++) {
    const currentTime = new Date(sortedBlocks[i].timestamp).getTime();
    const prevTime = new Date(sortedBlocks[i - 1].timestamp).getTime();
    totalBlockTime += (currentTime - prevTime) / 1000;
    totalTx += sortedBlocks[i].txCount;
  }

  const avgBlockTime = totalBlockTime / (sortedBlocks.length - 1);
  const avgTx = totalTx / sortedBlocks.length;

  return { avgBlockTime, avgTx };
};

export default function ScoreBoard({
  loading,
  blocks,
  WncgPrice,
  WncgMarketCap,
  WncgChange24h,
}: ScoreBoardProps) {
  const { avgBlockTime, avgTx } = calculateStats(blocks);
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-col lg:flex-row p-6">
        <div className="w-full lg:w-1/4">
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-bold text-gray-500 uppercase mb-3">WNCG Price</h5>
              <div className="text-left">
                {loading ? (
                  <div className="h-8 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <div className="text-3xl font-bold">
                    ${WncgPrice.toFixed(2)}
                    <span className="text-gray-800 text-sm font-normal ml-1">/WNCG</span>
                    <span
                      className={`text-sm font-bold text-bright-blue ml-2 ${WncgChange24h < 0 ? 'text-red-700' : 'text-blue-700'}`}
                    >
                      ({WncgChange24h.toFixed(2)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-bold text-gray-500 uppercase mb-3">Market Cap</h5>
              <div className="text-left">
                {loading ? (
                  <div className="h-8 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <div className="text-3xl font-bold">
                    ${formatNumber(Number(WncgMarketCap.toFixed()))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-px bg-gray-200 mx-6" />

        <div className="w-full lg:w-2/4 mt-6 lg:mt-0">
          <div>
            <h5 className="text-sm font-bold text-gray-500 uppercase mb-3">Network Performance</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center sm:text-left">
                {loading ? (
                  <div className="flex justify-center sm:justify-start mb-2">
                    <LoadingSpinner size="sm" color="gray" />
                  </div>
                ) : (
                  <div className="text-2xl font-bold mb-1">{avgBlockTime.toFixed(2)}s</div>
                )}
                <span className="text-sm text-gray-600">Avg Block Time</span>
              </div>

              <div className="text-center sm:text-left">
                {loading ? (
                  <div className="flex justify-center sm:justify-start mb-2">
                    <LoadingSpinner size="sm" color="gray" />
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

        <div className="hidden lg:block w-px bg-gray-200 mx-6" />

        <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
          <div>
            <h5 className="text-sm font-bold text-gray-500 uppercase mb-6">Transaction History</h5>
            <TxHistoryChart blocks={blocks} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
