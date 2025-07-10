interface Action {
  inspection?: {
    typeId: string;
    productType?: string;
    amount?: [any, any];
    avatarAddress?: string;
  };
}

interface Transaction {
  id: string;
  blockIndex: number;
  blockTimestamp?: string;
  timestamp: string;
  signer: string;
  involved?: {
    type: string;
  };
  actions: Action[];
}

interface TransactionTableProps {
  loading: boolean;
  transactions: Transaction[];
  detail?: boolean;
  involved?: boolean;
  embedMode?: boolean;
  latestBlockIndex?: number;
}

export default function TransactionTable({
  loading,
  transactions,
  detail = false,
  involved = false,
  embedMode = false,
  latestBlockIndex = 0,
}: TransactionTableProps) {
  const shortAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const txTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - txTime.getTime()) / 1000);

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

  if (transactions.length === 0) {
    return (
      <div className="bg-white">
        <div className="h-2 bg-blue-600" />
        <div className="h-96 bg-white flex items-center justify-center">
          <span className="text-gray-500">No Transactions</span>
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tx Hash</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Block</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Age</th>
              {detail && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Confirm</th>
              )}
              {!embedMode && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">From</th>
              )}
              {involved && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Involved
                </th>
              )}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              {detail && <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700" />}
              {(detail || embedMode) && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Avatar</th>
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-blue-600 hover:text-blue-800">
                  <a href={`/transaction/${tx.id}`} className="hover:underline">
                    {shortAddress(tx.id)}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    {tx.blockIndex}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {formatTimeAgo(tx.blockTimestamp || tx.timestamp)}
                </td>
                {detail && (
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border">
                      <strong className="mr-1">{latestBlockIndex - tx.blockIndex + 1}</strong>{' '}
                      Confirms
                    </span>
                  </td>
                )}
                {!embedMode && (
                  <td className="px-4 py-3 text-sm text-blue-600 hover:text-blue-800">
                    <a href={`/account/${tx.signer}`} className="hover:underline">
                      {tx.signer.substring(0, 8)}
                    </a>
                  </td>
                )}
                {involved && (
                  <td className="px-4 py-3">
                    {tx.involved && (
                      <span
                        className={`px-2 py-1 text-xs rounded border ${
                          tx.involved.type === 'INVOLVED'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-green-100 text-green-800 border-green-300'
                        }`}
                      >
                        {tx.involved.type}
                      </span>
                    )}
                  </td>
                )}
                <td className="px-4 py-3">
                  {tx.actions.map(
                    (action, index) =>
                      action.inspection && (
                        <div
                          key={index}
                          className="inline-flex items-center px-3 py-1 mx-1 text-xs bg-orange-50 text-orange-600 border border-orange-200 rounded-full"
                        >
                          <button
                            type="button"
                            className="w-3 h-3 mr-1 text-orange-600 hover:text-orange-800"
                          >
                            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          {action.inspection.typeId}
                          {action.inspection.productType && (
                            <span className="text-xs opacity-80 ml-1">
                              ({action.inspection.productType})
                            </span>
                          )}
                        </div>
                      )
                  )}
                </td>
                {detail && (
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {tx.actions[0]?.inspection?.amount && (
                      <span>Amount: {tx.actions[0].inspection.amount[1]}</span>
                    )}
                  </td>
                )}
                {(detail || embedMode) && (
                  <td className="px-4 py-3 text-sm text-blue-600 hover:text-blue-800">
                    {tx.actions.map(
                      (action, index) =>
                        action.inspection?.avatarAddress && (
                          <a
                            key={index}
                            href={`/avatar/${action.inspection.avatarAddress}`}
                            className="mx-1 hover:underline"
                          >
                            {action.inspection.avatarAddress.substring(0, 8)}
                          </a>
                        )
                    )}
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
