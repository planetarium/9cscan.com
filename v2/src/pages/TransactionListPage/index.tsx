import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useGetBlocksQuery,
  useGetTransactionsQuery,
  useGetActionTypesQuery,
} from '@/graphql-mimir/generated/graphql';
import TransactionTable, { type Transaction } from '@/components/TransactionTable';
import ActionsSelect from '@/components/ActionsSelect';

const ITEMS_PER_PAGE = 20;

type TransactionListPageVariables = {
  skip: number;
  take: number;
  actionTypeId?: string;
};

export default function TransactionListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const action = searchParams.get('action') || '';

  const { data: actionTypesData } = useGetActionTypesQuery();

  const transactionVariables: TransactionListPageVariables = {
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    ...(action ? { actionTypeId: action } : {}),
  };

  const { data: transactionsData, loading: transactionsLoading } = useGetTransactionsQuery({
    variables: transactionVariables,
    pollInterval: 8 * 1000,
  });

  const { data: blocksData } = useGetBlocksQuery({
    variables: { skip: 0, take: 1 },
  });

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
              amount: transaction.firstNCGAmountInActionArguments || undefined,
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

  const handleActionFilterChange = (selectedAction: string) => {
    const newSearchParams = new URLSearchParams();
    if (selectedAction) {
      newSearchParams.set('action', selectedAction);
    }
    setSearchParams(newSearchParams);
  };

  const hasNextPage = transactionsData?.transactions?.pageInfo?.hasNextPage || false;
  const latestBlockIndex = blocksData?.blocks?.items?.[0]?.object?.index || 0;
  const actionTypes = actionTypesData?.actionTypes || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
          <ActionsSelect
            value={action}
            onChange={handleActionFilterChange}
            actionTypes={actionTypes}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <TransactionTable
            loading={transactionsLoading}
            transactions={transactions}
            detail
            latestBlockIndex={latestBlockIndex}
          />

          {!transactionsLoading && transactions.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
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
      </div>
    </div>
  );
}
