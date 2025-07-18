import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetTransactionsQuery, useGetBlocksQuery } from '@/graphql-mimir/generated/graphql';
import TransactionTable, { type Transaction } from '@/components/TransactionTable';
import ActionsSelect from '@/components/ActionsSelect';
import Pagination from '@/components/common/Pagination';

const ITEMS_PER_PAGE = 20;

export default function TransactionListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);

  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const action = searchParams.get('action') || '';

  const transactionVariables = {
    skip: (page - 1) * pageSize,
    take: pageSize,
    ...(action ? { actionTypeId: action } : {}),
  };

  const { data: transactionsData, loading: transactionsLoading } = useGetTransactionsQuery({
    variables: transactionVariables,
    pollInterval: 8 * 1000,
  });

  const { data: blocksData } = useGetBlocksQuery({
    variables: { skip: 0, take: 1 },
  });

  const latestBlockIndex = blocksData?.blocks?.items?.[0]?.object?.index || 0;

  useEffect(() => {
    if (transactionsData?.transactions?.items) {
      const transactionList: Transaction[] = transactionsData.transactions.items.map(
        (transaction) => ({
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
        })
      );
      setTransactions(transactionList);
    }
  }, [transactionsData]);

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', newPage.toString());
    }
    setSearchParams(newSearchParams);
  };

  const handleActionFilterChange = (actionType: string) => {
    const newSearchParams = new URLSearchParams();
    if (actionType) {
      newSearchParams.set('action', actionType);
    }
    setSearchParams(newSearchParams);
  };

  const handleSizeChange = (size: number) => {
    setPageSize(size);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('page');
    setSearchParams(newSearchParams);
  };

  const hasNextPage = transactionsData?.transactions?.pageInfo?.hasNextPage || false;
  const hasPreviousPage = transactionsData?.transactions?.pageInfo?.hasPreviousPage || false;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Transactions</h1>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <ActionsSelect
                value={action}
                onChange={handleActionFilterChange}
              />
            </div>
          </div>

          <TransactionTable
            loading={transactionsLoading}
            transactions={transactions}
            detail
            latestBlockIndex={latestBlockIndex}
          />

          <div className="mt-4">
            <Pagination
              size={pageSize}
              page={page}
              canNext={hasNextPage}
              canPrev={hasPreviousPage}
              onGoFirst={() => handlePageChange(1)}
              onNext={() => handlePageChange(page + 1)}
              onPrev={() => handlePageChange(page - 1)}
              onUpdateSize={handleSizeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
