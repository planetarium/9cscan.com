import SearchSection from '@/components/SearchSection';
import BlockTable, { type Block } from '@/components/BlockTable';
import TransactionTable, { type Transaction } from '@/components/TransactionTable';
import ScoreBoard from '@/components/ScoreBoard';
import LinkButton from '@/components/common/LinkButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import {
  useGetBlocksQuery,
  useGetTransactionsQuery,
  useGetBlocksForStatsQuery,
} from '@/graphql-mimir/generated/graphql';
import { useWNCG } from '@/hooks/useWNCG';

export default function MainPage() {
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

  const { wncgData, loading: wncgLoading } = useWNCG();

  const loading = blocksLoading || transactionsLoading || statsLoading || wncgLoading;

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
          amount: transaction.firstNCGAmountInActionArguments ? [{
            ticker: 'NCG',
            decimalPlaces: 2
          }, Number(transaction.firstNCGAmountInActionArguments)] : undefined,
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
      <SearchSection />

      <div className="max-w-[1440px] min-w-xs mx-auto px-4 py-10">
        <div className="mb-6">
          <div className="flex items-center text-sm font-bold text-gray-500 uppercase">
            <span>Block Height</span>
            {loading ? (
              <div className="ml-2">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <strong className="ml-2 text-bright-blue">#{latestBlockIndex}</strong>
            )}
          </div>

          <div className="mt-2">
            <ScoreBoard
              loading={loading}
              blocks={statsBlocks}
              WncgPrice={wncgData.price}
              WncgMarketCap={wncgData.marketCap}
              WncgChange24h={wncgData.percentChange24h}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Latest Blocks</h4>
            <BlockTable loading={loading} blocks={latestBlocks10} />
            <div className="flex justify-center mt-4">
              <LinkButton
                to="/blocks"
                variant="outline"
                className="w-full text-bright-blue border-bright-blue font-light"
              >
                View all blocks
              </LinkButton>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">Latest Transactions</h4>
            <TransactionTable
              loading={loading}
              transactions={latestTransactions10}
              latestBlockIndex={latestBlockIndex}
            />
            <div className="flex justify-center mt-4">
              <LinkButton
                to="/transactions"
                variant="outline"
                className="w-full text-bright-blue border-bright-blue font-light"
              >
                View all transactions
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
