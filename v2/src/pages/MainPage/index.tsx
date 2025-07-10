import { Link } from 'react-router-dom';
import SearchSection from '@/components/SearchSection';
import BlockTable, { type Block } from '@/components/BlockTable';
import TransactionTable, { type Transaction } from '@/components/TransactionTable';
import ScoreBoard from '@/components/ScoreBoard';
import {
  useGetBlocksQuery,
  useGetTransactionsQuery,
  useGetBlocksForStatsQuery,
} from '@/graphql-mimir/generated/graphql';

export default function MainPage() {
  const handleSearch = (keyword: string) => {
    console.log('Searching for:', keyword);
  };

  const { data: blocksData, loading: blocksLoading } = useGetBlocksQuery({
    variables: { skip: 0, take: 10 },
    pollInterval: 8 * 1000,
  });

  const { data: transactionsData, loading: transactionsLoading } = useGetTransactionsQuery({
    variables: { skip: 0, take: 10 },
    pollInterval: 8 * 1000,
  });

  const { data: statsData, loading: statsLoading } = useGetBlocksForStatsQuery({
    variables: { skip: 0, take: 100 },
    pollInterval: 8 * 1000,
  });

  const loading = blocksLoading || transactionsLoading || statsLoading;

  const latestBlocks10: Block[] =
    blocksData?.blocks?.items?.map((block) => ({
      index: block.object.index,
      hash: block.object.hash,
      timestamp: block.object.timestamp,
      transactionCount: block.object.txCount,
      miner: block.object.miner,
      stateRootHash: block.object.stateRootHash,
    })) || [];

  const latestBlockIndex = blocksData?.blocks?.items?.[0]?.object?.index || 0;

  const latestTransactions10: Transaction[] =
    transactionsData?.transactions?.items?.map((transaction) => ({
      id: transaction.object.id,
      blockIndex: transaction.blockIndex,
      blockTimestamp: transaction.object.timestamp,
      timestamp: transaction.object.timestamp,
      signer: transaction.object.signer,
      actions: transaction.object.actions.map((action) => ({
        inspection: {
          typeId: action.typeId || '',
          avatarAddress: transaction.firstAvatarAddressInActionArguments || '',
          // amount: transaction.firstNCGAmountInActionArguments || [0, 0],
        },
      })),
    })) || [];

  const statsBlocks =
    statsData?.blocks?.items?.map((block) => ({
      index: block.object.index,
      timestamp: block.object.timestamp,
      txCount: block.object.txCount,
    })) || [];

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
              blocks={statsBlocks}
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
              <Link
                to="/blocks"
                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-center"
              >
                View all blocks
              </Link>
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
              <Link
                to="/transactions"
                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-center"
              >
                View all transactions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
