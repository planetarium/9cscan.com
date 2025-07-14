import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  useGetBlockQuery,
  useGetTransactionsQuery,
  useGetActionTypesQuery,
} from '@/graphql-mimir/generated/graphql';
import TransactionTable, { type Transaction } from '@/components/TransactionTable';
import CopyBtn from '@/components/CopyBtn';
import ActionsSelect from '@/components/ActionsSelect';
import type { Block } from '@/components/BlockTable';

type BlockPageTransactionsVariables = {
  skip: number;
  take: number;
  blockIndex?: number;
  actionTypeId?: string;
};

export default function BlockPage() {
  const { index } = useParams<{ index: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [blockIndex, setBlockIndex] = useState(Number.parseInt(index || '0', 10));
  const [actionFilter, setActionFilter] = useState(searchParams.get('action') || '');

  const { data: blockData, loading: blockLoading } = useGetBlockQuery({
    variables: { index: blockIndex },
    skip: !blockIndex,
  });

  const { data: actionTypesData } = useGetActionTypesQuery();

  const transactionVariables: BlockPageTransactionsVariables = {
    skip: 0,
    take: 100,
    ...(blockIndex ? { blockIndex } : {}),
    ...(actionFilter ? { actionTypeId: actionFilter } : {}),
  };
  const { data: transactionsData, loading: transactionsLoading } = useGetTransactionsQuery({
    variables: transactionVariables,
    skip: !blockIndex,
  });

  const loading = blockLoading || transactionsLoading;

  const block: Block = blockData?.block?.object
    ? {
        index: blockData.block.object.index,
        hash: blockData.block.object.hash,
        timestamp: blockData.block.object.timestamp,
        miner: blockData.block.object.miner,
        stateRootHash: blockData.block.object.stateRootHash,
        transactionCount: blockData.block.object.txCount,
      }
    : {
        index: 0,
        hash: '',
        timestamp: '',
        miner: '',
        stateRootHash: '',
        transactionCount: 0,
      };

  const transactions: Transaction[] =
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
        },
      })),
    })) || [];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const blockTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - blockTime.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handlePrevBlock = () => {
    const newIndex = blockIndex - 1;
    setBlockIndex(newIndex);
    navigate(`/block/${newIndex}`);
  };

  const handleNextBlock = () => {
    const newIndex = blockIndex + 1;
    setBlockIndex(newIndex);
    navigate(`/block/${newIndex}`);
  };

  const handleActionFilterChange = (action: string) => {
    setActionFilter(action);
    if (action) {
      setSearchParams({ action });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (index) {
      setBlockIndex(Number.parseInt(index, 10));
    }
  }, [index]);

  useEffect(() => {
    const action = searchParams.get('action');
    setActionFilter(action || '');
  }, [searchParams]);

  const actionTypes = actionTypesData?.actionTypes || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Block <span className="text-blue-600">#{blockIndex}</span>
        </h1>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading block information...</p>
          </div>
        ) : block ? (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="h-1 bg-blue-600" />
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-1 font-semibold text-gray-700">Block Height:</div>
                <div className="md:col-span-3 flex items-center">
                  <strong className="text-lg">{block.index}</strong>
                  <button
                    type="button"
                    onClick={handlePrevBlock}
                    className="ml-3 px-2 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextBlock}
                    className="ml-1 px-2 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-1 font-semibold text-gray-700">Block Hash:</div>
                <div className="md:col-span-3 font-mono text-sm text-gray-600 flex items-center">
                  {block.hash}
                  <CopyBtn text={block.hash} xSmall icon contentClass="ml-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </CopyBtn>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-1 font-semibold text-gray-700">Transactions:</div>
                <div className="md:col-span-3">{block.transactionCount} Transactions</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-1 font-semibold text-gray-700">Timestamp:</div>
                <div className="md:col-span-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formatTimeAgo(block.timestamp)}
                  <span className="text-gray-500 ml-2">({formatDateTime(block.timestamp)})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-1 font-semibold text-gray-700">Mined by:</div>
                <div className="md:col-span-3">
                  <a
                    href={`/account/${block.miner}?t=mined`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {block.miner}
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 font-semibold text-gray-700">State Root Hash:</div>
                <div className="md:col-span-3 font-mono text-sm text-gray-600">
                  0x{block.stateRootHash}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600">Block not found</p>
          </div>
        )}

        {block && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Transactions</h2>
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <ActionsSelect
                  value={actionFilter}
                  onChange={handleActionFilterChange}
                  actionTypes={actionTypes}
                />
                <span className="text-sm text-gray-600">
                  Total {block.transactionCount} Transactions
                </span>
              </div>
              <TransactionTable
                loading={loading}
                transactions={transactions}
                detail
                latestBlockIndex={block.index}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
