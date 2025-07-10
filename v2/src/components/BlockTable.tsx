interface Block {
  index: number;
  hash: string;
  timestamp: string;
  transactionCount: number;
  miner: string;
  stateRootHash: string;
}

interface BlockTableProps {
  loading: boolean;
  blocks: Block[];
  detail?: boolean;
}

export default function BlockTable({ loading, blocks, detail = false }: BlockTableProps) {
  const shortAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const blockTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - blockTime.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="bg-white">
        <div className="h-2 bg-blue-600 animate-pulse" />
        <div className="h-96 bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="bg-white">
        <div className="h-2 bg-blue-600" />
        <div className="h-96 bg-white flex items-center justify-center">
          <span className="text-gray-500">No Blocks</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="h-2 bg-blue-600" />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Block</th>
              {detail && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hash</th>
              )}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Age</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Tx</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Miner</th>
              {detail && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  State Root Hash
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr
                key={block.index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    {block.index}
                  </button>
                </td>
                {detail && (
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                    {shortAddress(block.hash)}
                  </td>
                )}
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {formatTimeAgo(block.timestamp)}
                </td>
                <td className="px-4 py-3 text-sm text-blue-600 hover:text-blue-800">
                  <a href={`/block/${block.index}#tx`} className="hover:underline">
                    {block.transactionCount}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-blue-600 hover:text-blue-800">
                  <a href={`/account/${block.miner}?t=mined`} className="hover:underline">
                    {block.miner.substring(0, 8)}
                  </a>
                </td>
                {detail && (
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                    {shortAddress(block.stateRootHash)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
