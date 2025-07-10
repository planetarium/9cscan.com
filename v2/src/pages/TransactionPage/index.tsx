import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGetTransactionQuery } from '@/graphql-mimir/generated/graphql';
import CopyBtn from '@/components/CopyBtn';

interface Transaction {
  id: string;
  blockIndex: number;
  blockTimestamp: string;
  timestamp: string;
  signer: string;
  signature: string;
  publicKey: string;
  nonce: number;
  txStatus: string;
  updatedAddresses: string[];
  actions: Array<{
    typeId: string;
    avatarAddress?: string;
    id?: string;
    [key: string]: any;
  }>;
}

export default function TransactionPage() {
  const { id } = useParams<{ id: string }>();
  const [txId, setTxId] = useState(id || '');

  const { data, loading } = useGetTransactionQuery({
    variables: { txId: txId },
    skip: !txId,
  });

  const transaction: Transaction | null = data?.transaction
    ? {
        id: data.transaction.object.id || '',
        blockIndex: data.transaction.blockIndex || 0,
        blockTimestamp: data.transaction.object.timestamp || '',
        timestamp: data.transaction.object.timestamp || '',
        signer: data.transaction.object.signer || '',
        signature: data.transaction.object.signature || '',
        publicKey: data.transaction.object.publicKey || '',
        nonce: data.transaction.object.nonce || 0,
        txStatus: data.transaction.object.txStatus || '',
        updatedAddresses: data.transaction.object.updatedAddresses || [],
        actions:
          data.transaction.object.actions?.map((action) => ({
            typeId: action.typeId || '',
            avatarAddress: data.transaction.firstAvatarAddressInActionArguments || '',
            id: data.transaction.firstActionTypeId || '',
            ...action.values,
          })) || [],
      }
    : null;

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const txTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - txTime.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INVALID':
      case 'STAGING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    if (id) {
      setTxId(id);
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Transaction Details</h1>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading transaction information...</p>
          </div>
        ) : transaction ? (
          <>
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="h-1 bg-blue-600" />
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1 font-semibold text-gray-700">Transaction Hash:</div>
                  <div className="md:col-span-3 font-mono text-sm text-gray-600 flex items-center">
                    {transaction.id}
                    <CopyBtn text={transaction.id} xSmall icon contentClass="ml-2">
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
                  <div className="md:col-span-1 font-semibold text-gray-700">Status:</div>
                  <div className="md:col-span-3">
                    <span
                      className={`px-2 py-1 text-xs rounded border ${getStatusColor(transaction.txStatus)}`}
                    >
                      {transaction.txStatus || 'UNKNOWN'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1 font-semibold text-gray-700">Block:</div>
                  <div className="md:col-span-3">
                    <Link
                      to={`/block/${transaction.blockIndex}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {transaction.blockIndex}
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1 font-semibold text-gray-700">Age:</div>
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
                    {formatTimeAgo(transaction.blockTimestamp)}
                    <span className="text-gray-500 ml-2">
                      ({formatDateTime(transaction.blockTimestamp)})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1 font-semibold text-gray-700">Timestamp:</div>
                  <div className="md:col-span-3">{formatDateTime(transaction.timestamp)}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1 font-semibold text-gray-700">Signer:</div>
                  <div className="md:col-span-3">
                    <Link
                      to={`/account/${transaction.signer}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {transaction.signer}
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1 font-semibold text-gray-700">
                    Updated Addresses:
                  </div>
                  <div className="md:col-span-3">
                    {transaction.updatedAddresses.map((addr) => (
                      <div key={addr}>
                        <Link
                          to={`/account/${addr}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {addr}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1 font-semibold text-gray-700">Signature:</div>
                  <div className="md:col-span-3 font-mono text-sm text-gray-600">
                    {transaction.signature}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-1 font-semibold text-gray-700">Public Key:</div>
                  <div className="md:col-span-3 font-mono text-sm text-gray-600">
                    {transaction.publicKey}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 font-semibold text-gray-700">Nonce:</div>
                  <div className="md:col-span-3">{transaction.nonce}</div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-4">Action Data</h2>
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="h-1 bg-blue-600" />
              {!transaction.actions || transaction.actions.length === 0 ? (
                <div className="p-12 text-center text-gray-600">No Action Data</div>
              ) : (
                transaction.actions.map((action, index) => (
                  <div
                    key={`${action.typeId}-${index}`}
                    className="p-6 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="md:col-span-1 font-semibold text-gray-700">Type:</div>
                      <div className="md:col-span-3">{action.typeId}</div>
                    </div>

                    {action.avatarAddress && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="md:col-span-1 font-semibold text-gray-700">Avatar:</div>
                        <div className="md:col-span-3">
                          <Link
                            to={`/avatar/${action.avatarAddress}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {action.avatarAddress}
                          </Link>
                        </div>
                      </div>
                    )}

                    {action.id && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="md:col-span-1 font-semibold text-gray-700">Id:</div>
                        <div className="md:col-span-3">{action.id}</div>
                      </div>
                    )}

                    {Object.keys(action).map((key) => {
                      if (['typeId', 'avatarAddress', 'id'].includes(key)) return null;
                      return (
                        <div
                          key={key}
                          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 bg-gray-50 p-4 rounded"
                        >
                          <div className="md:col-span-1 font-normal text-gray-600">{key}:</div>
                          <div className="md:col-span-3 text-gray-800">{String(action[key])}</div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600">Transaction not found</p>
          </div>
        )}
      </div>
    </div>
  );
}
