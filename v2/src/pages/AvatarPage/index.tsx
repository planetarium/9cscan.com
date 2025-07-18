import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useGetAvatarQuery,
  useGetNcgQuery,
  useGetWncgPriceQuery,
} from '../../graphql-mimir/generated/graphql';
import CopyBtn from '../../components/CopyBtn';
import TransactionTable, { type Transaction } from '../../components/TransactionTable';
import ActionsSelect from '../../components/ActionsSelect';
import {
  useGetTransactionsQuery,
} from '../../graphql-mimir/generated/graphql';

const ITEMS_PER_PAGE = 20;

const transformTransaction = (tx: any): Transaction => ({
  id: tx.id,
  blockIndex: tx.blockIndex,
  timestamp: tx.object.timestamp,
  signer: tx.object.signer,
  actions: tx.object.actions.map((action: any) => ({
    inspection: {
      typeId: action.typeId || '',
      avatarAddress: tx.firstAvatarAddressInActionArguments || '',
      amount: tx.firstNCGAmountInActionArguments || undefined,
    },
  })),
});

const AvatarPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const avatarAddress = address?.toLowerCase() || '';

  const { data, loading } = useGetAvatarQuery({
    variables: { avatarAddress },
    skip: !avatarAddress,
  });
  const { data: ncgData } = useGetNcgQuery({
    variables: { address: data?.avatar?.agentAddress || '' },
    skip: !data?.avatar?.agentAddress,
  });
  const { data: wncgPriceData } = useGetWncgPriceQuery();

  const avatar = data?.avatar;
  const dailyRewardIndex = data?.dailyRewardReceivedBlockIndex;
  const ncgBalance = ncgData ? Number.parseFloat(ncgData.balance) : 0;
  const wncgPrice = wncgPriceData?.wncgPrice?.quote?.usd?.price || 0;
  const ncgValue = ncgBalance * wncgPrice;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!avatar) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Avatar Not Found</h1>
          <p className="text-gray-600">The avatar address you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Avatar{' '}
          <span className="text-sm font-mono text-gray-600">
            {avatar.address}
            <CopyBtn text={avatar.address} />
          </span>
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Balance:</h3>
              <div className="text-2xl font-bold text-green-600">
                {ncgBalance.toLocaleString()} GOLD (NCG)
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">WNCG Value:</h3>
              <div className="text-2xl font-bold text-blue-600">
                ${ncgValue.toLocaleString()}{' '}
                <span className="text-sm text-gray-500">(@ ${wncgPrice.toFixed(2)}/WNCG)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-2">
                <span className="font-semibold">Avatar Name:</span> {avatar.name}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Level:</span> {avatar.level}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Account:</span>{' '}
                <Link
                  to={`/account/${avatar.agentAddress}`}
                  className="text-blue-600 hover:underline"
                >
                  {avatar.agentAddress}
                </Link>
              </div>
              <div className="mb-2">
                <span className="font-semibold">CharacterId:</span> {avatar.characterId}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Daily Reward Index:</span>{' '}
                <Link to={`/block/${dailyRewardIndex}`} className="text-blue-600 hover:underline">
                  {dailyRewardIndex}
                </Link>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Block:</span>{' '}
                <Link to={`/block/${avatar.blockIndex}`} className="text-blue-600 hover:underline">
                  {avatar.blockIndex}
                </Link>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Updated Block:</span>{' '}
                <Link to={`/block/${avatar.updatedAt}`} className="text-blue-600 hover:underline">
                  {avatar.updatedAt}
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {avatar.exp !== undefined && (
                <span className="px-2 py-1 bg-gray-100 rounded">Exp {avatar.exp}</span>
              )}
              {avatar.tail !== undefined && (
                <span className="px-2 py-1 bg-gray-100 rounded">Tail {avatar.tail}</span>
              )}
              {avatar.lens !== undefined && (
                <span className="px-2 py-1 bg-gray-100 rounded">Lens {avatar.lens}</span>
              )}
              {avatar.hair !== undefined && (
                <span className="px-2 py-1 bg-gray-100 rounded">Hair {avatar.hair}</span>
              )}
              {avatar.ear !== undefined && (
                <span className="px-2 py-1 bg-gray-100 rounded">Ear {avatar.ear}</span>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Transactions</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <AvatarTransactionList address={avatarAddress} />
        </div>
      </div>
    </div>
  );
};

const AvatarTransactionList: React.FC<{ address: string }> = ({ address }) => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [page, setPage] = React.useState(1);
  const [action, setAction] = React.useState('');



  const transactionVariables = {
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    avatarAddress: address,
    ...(action ? { actionTypeId: action } : {}),
  };

  const { data: transactionsData, loading: transactionsLoading } = useGetTransactionsQuery({
    variables: transactionVariables,
  });

  React.useEffect(() => {
    if (transactionsData?.transactions?.items) {
      const transactionList: Transaction[] =
        transactionsData.transactions.items.map(transformTransaction);
      setTransactions(transactionList);
    }
  }, [transactionsData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleActionFilterChange = (selectedAction: string) => {
    setAction(selectedAction);
    setPage(1);
  };

  const hasNextPage = transactionsData?.transactions?.pageInfo?.hasNextPage || false;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
                      <ActionsSelect
                value={action}
                onChange={handleActionFilterChange}
              />
      </div>
      <TransactionTable transactions={transactions} loading={transactionsLoading} />
      {!transactionsLoading && transactions.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page}</div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-600">Page {page}</span>
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={!hasNextPage}
                className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarPage;
