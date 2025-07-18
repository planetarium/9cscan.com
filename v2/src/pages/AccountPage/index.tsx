import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  useGetAgentQuery,
  useGetAvatarsInformationQuery,
  useGetAvatarAddressesQuery,
  useGetNcgQuery,
  useGetWncgPriceQuery,
  useGetTransactionsQuery,
  useGetBlocksQuery,
} from '../../graphql-mimir/generated/graphql';
import CopyBtn from '../../components/CopyBtn';
import TransactionTable, { type Transaction } from '../../components/TransactionTable';
import BlockTable, { type Block } from '../../components/BlockTable';
import ActionsSelect from '../../components/ActionsSelect';

const TABS = { mined: 1, transfer: 2 };
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

const transformBlock = (block: any): Block => ({
  index: block.object.index,
  hash: block.object.hash,
  timestamp: block.object.timestamp,
  transactionCount: block.object.txCount,
  miner: block.object.miner,
  stateRootHash: block.object.stateRootHash,
});

export const AccountPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(TABS[searchParams.get('t') as keyof typeof TABS] || 0);

  const agentAddress = address?.toLowerCase();

  const { data: agentData, loading: agentLoading } = useGetAgentQuery({
    variables: { agentAddress: agentAddress || '' },
    skip: !agentAddress,
  });

  const { data: ncgData, loading: ncgLoading } = useGetNcgQuery({
    variables: { address: agentAddress || '' },
    skip: !agentAddress,
  });

  const { data: wncgPriceData } = useGetWncgPriceQuery();

  const { data: avatarAddressesData } = useGetAvatarAddressesQuery({
    variables: { address: agentAddress || '' },
    skip: !agentAddress,
  });

  const avatarAddressList = useMemo(() => {
    const result: Array<string> = [];

    for (const element of avatarAddressesData?.agent?.avatarAddresses || []) {
      if (!element.value) continue;
      result.push(element.value);
    }
    return result;
  }, [avatarAddressesData]);

  const { data: avatarsData, loading: avatarsLoading } = useGetAvatarsInformationQuery({
    variables: {
      avatarAddress1: avatarAddressList[0] || '',
      avatarAddress2: avatarAddressList[1] || avatarAddressList[avatarAddressList.length - 1] || '',
      avatarAddress3: avatarAddressList[2] || avatarAddressList[avatarAddressList.length - 1] || '',
    },
    skip: avatarAddressList.length === 0,
  });

  const wncgPrice = wncgPriceData?.wncgPrice?.quote?.usd?.price || 0;
  const ncgBalance = ncgData ? Number.parseFloat(ncgData.balance) : 0;
  const ncgValue = ncgBalance * wncgPrice;

  const agentNotFound = !agentLoading && !agentData?.agent;

  const handleTabChange = (newTab: number) => {
    setTab(newTab);
    if (newTab === 0) {
      setSearchParams({});
    } else if (newTab === 1) {
      setSearchParams({ t: 'mined' });
    } else if (newTab === 2) {
      setSearchParams({ t: 'transfer', action: 'transfer_asset5' });
    }
  };

  if (agentLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Address{' '}
          <span className="text-sm font-mono text-gray-600">
            {address}
            <CopyBtn text={address || ''} />
          </span>
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {agentNotFound && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Agent information not available
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      This address may not be registered as an agent, but other information is still
                      available.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Balance:</h3>
              <div className="text-2xl font-bold text-green-600">
                {ncgLoading ? (
                  <div className="animate-pulse h-8 bg-gray-200 rounded w-32" />
                ) : (
                  <>{ncgBalance.toLocaleString()} GOLD (NCG)</>
                )}
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

          {avatarAddressList.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nine Chronicles Avatars:</h3>
              <div className="space-y-2">
                {avatarsLoading ? (
                  <div className="animate-pulse space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded w-64" />
                    ))}
                  </div>
                ) : (
                  <>
                    {avatarsData?.avatar1 && (
                      <div>
                        <Link
                          to={`/avatar/${avatarsData.avatar1.address}`}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {avatarsData.avatar1.address} ({avatarsData.avatar1.name})
                        </Link>
                      </div>
                    )}
                    {avatarsData?.avatar2 && (
                      <div>
                        <Link
                          to={`/avatar/${avatarsData.avatar2.address}`}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {avatarsData.avatar2.address} ({avatarsData.avatar2.name})
                        </Link>
                      </div>
                    )}
                    {avatarsData?.avatar3 && (
                      <div>
                        <Link
                          to={`/avatar/${avatarsData.avatar3.address}`}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {avatarsData.avatar3.address} ({avatarsData.avatar3.name})
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                type="button"
                onClick={() => handleTabChange(0)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  tab === 0
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions
              </button>
              <button
                type="button"
                onClick={() => handleTabChange(1)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  tab === 1
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mined Blocks
              </button>
              <button
                type="button"
                onClick={() => handleTabChange(2)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  tab === 2
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                NCG Transfer
              </button>
            </nav>
          </div>

          <div className="p-6">
            {tab === 0 && <AccountTransactionList address={agentAddress || ''} />}
            {tab === 1 && <AccountBlockList miner={agentAddress || ''} />}
            {tab === 2 && <AccountTransferList address={agentAddress || ''} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountTransactionList: React.FC<{ address: string }> = ({ address }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const action = searchParams.get('action') || '';



  const transactionVariables = {
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    signer: address,
    ...(action ? { actionTypeId: action } : {}),
  };

  const { data: transactionsData, loading: transactionsLoading } = useGetTransactionsQuery({
    variables: transactionVariables,
  });

  useEffect(() => {
    if (transactionsData?.transactions?.items) {
      const transactionList: Transaction[] =
        transactionsData.transactions.items.map(transformTransaction);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Transactions</h3>
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

const AccountBlockList: React.FC<{ miner: string }> = ({ miner }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blocks, setBlocks] = useState<Block[]>([]);

  const page = Number.parseInt(searchParams.get('page') || '1', 10);

  const { data: blocksData, loading: blocksLoading } = useGetBlocksQuery({
    variables: {
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    },
  });

  useEffect(() => {
    if (blocksData?.blocks?.items) {
      const blockList: Block[] = blocksData.blocks.items.map(transformBlock);
      const filteredBlocks = blockList.filter(
        (block) => block.miner.toLowerCase() === miner.toLowerCase()
      );
      setBlocks(filteredBlocks);
    }
  }, [blocksData, miner]);

  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newPage === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', newPage.toString());
    }
    setSearchParams(newSearchParams);
  };

  const hasNextPage = blocksData?.blocks?.pageInfo?.hasNextPage || false;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">Mined Blocks</h3>

      <BlockTable blocks={blocks} loading={blocksLoading} />

      {!blocksLoading && blocks.length > 0 && (
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

const AccountTransferList: React.FC<{ address: string }> = ({ address }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const action = searchParams.get('action') || 'transfer_asset5';



  const transactionVariables = {
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    signer: address,
    actionTypeId: action,
  };

  const { data: transactionsData, loading: transactionsLoading } = useGetTransactionsQuery({
    variables: transactionVariables,
  });

  useEffect(() => {
    if (transactionsData?.transactions?.items) {
      const transactionList: Transaction[] =
        transactionsData.transactions.items.map(transformTransaction);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">NCG Transfers</h3>
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
