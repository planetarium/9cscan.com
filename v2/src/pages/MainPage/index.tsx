import SearchSection from '@/components/SearchSection';
import BlockTable from '@/components/BlockTable';
import TransactionTable from '@/components/TransactionTable';
import ScoreBoard from '@/components/ScoreBoard';
import { useGetBlocksForMainPageQuery } from '@/graphql-mimir/generated/graphql';

interface Block {
  index: number;
  hash: string;
  timestamp: string;
  transactionCount: number;
  miner: string;
  stateRootHash: string;
}

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

export default function MainPage() {
  const handleSearch = (keyword: string) => {
    console.log('Searching for:', keyword);
  };

  const { data, loading } = useGetBlocksForMainPageQuery({
    variables: { skip: 0, take: 10 },
    pollInterval: 8 * 1000,
  });

  const latestBlocks10: Block[] =
    data?.blocks?.items?.map((block) => ({
      index: block.object.index,
      hash: block.object.hash,
      timestamp: block.object.timestamp,
      transactionCount: block.object.transactions.length,
      miner: block.object.miner,
      stateRootHash: block.object.stateRootHash,
    })) || [];

  const latestBlockIndex = data?.blocks?.items?.[0]?.object?.index || 0;

  const latestTransactions10: Transaction[] =
    data?.blocks?.items?.flatMap(
      (block) =>
        block.object.transactions.map((transaction) => ({
          id: transaction.id,
          blockIndex: block.object.index,
          blockTimestamp: block.object.timestamp,
          timestamp: transaction.timestamp,
          signer: transaction.signer,
          actions:
            transaction.actions.map((action) => ({
              inspection: action.typeId ? { typeId: action.typeId } : undefined,
            })) || [],
        })) || []
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchSection onSearch={handleSearch} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center text-sm font-bold text-gray-700 uppercase">
            <span>Block Height</span>
            {loading ? (
              <div className="ml-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              </div>
            ) : (
              <strong className="ml-2 text-blue-600">#{latestBlockIndex}</strong>
            )}
          </div>

          <div className="mt-6">
            <ScoreBoard
              loading={loading}
              avgBlockTime={0}
              avgTx={0}
              WncgPrice={0}
              WncgMarketCap={0}
              WncgChange24h={0}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Latest Blocks</h4>
            <BlockTable loading={loading} blocks={latestBlocks10} />
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
              >
                View all blocks
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Latest Transactions</h4>
            <TransactionTable
              loading={loading}
              transactions={latestTransactions10}
              latestBlockIndex={latestBlockIndex}
            />
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
              >
                View all transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
