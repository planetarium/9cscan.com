import { shortAddress, formatTimeAgo } from '@/utils/commonUtils';
import TableHeader, { TableHeaderCell } from './common/TableHeader';
import TableRow, { TableCell } from './common/TableRow';
import Link from './common/Link';
import AmountLabel from './common/AmountLabel';

export interface Action {
  inspection?: {
    typeId: string;
    productType?: string;
    amount?: [any, number];
    avatarAddress?: string;
  };
}

export interface Transaction {
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

export interface TransactionTableProps {
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
  return (
    <div className="table-wrap bg-white">
      {loading && (
        <div className="h-0.5 bg-blue-600 animate-pulse"></div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader>
            <TableHeaderCell>Tx Hash</TableHeaderCell>
            <TableHeaderCell>Block</TableHeaderCell>
            <TableHeaderCell>Age</TableHeaderCell>
            {detail && <TableHeaderCell>Confirm</TableHeaderCell>}
            {!embedMode && <TableHeaderCell>From</TableHeaderCell>}
            {involved && <TableHeaderCell>Involved</TableHeaderCell>}
            <TableHeaderCell>Action</TableHeaderCell>
            {detail && <TableHeaderCell>Amount</TableHeaderCell>}
            {(detail || embedMode) && <TableHeaderCell>Avatar</TableHeaderCell>}
          </TableHeader>
          <tbody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="row-item transition-all duration-500">
                <TableCell
                  className="text-blue-600 hover:text-blue-800"
                  style={{ fontFamily: 'Helvetica' }}
                >
                  <Link href={`/transaction/${tx.id}`} className="hover:underline">
                    {shortAddress(tx.id)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/block/${tx.blockIndex}`}
                    className="inline-block px-3 py-1.5 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    {tx.blockIndex}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600 whitespace-nowrap">
                  {formatTimeAgo(tx.blockTimestamp || tx.timestamp)}
                </TableCell>
                {detail && (
                  <TableCell>
                    <div className="inline-flex items-center px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-700">
                      <strong className="mr-1">{latestBlockIndex - tx.blockIndex + 1}</strong>
                      Confirms
                    </div>
                  </TableCell>
                )}
                {!embedMode && (
                  <TableCell
                    className="text-blue-600 hover:text-blue-800"
                    style={{ fontFamily: 'Helvetica' }}
                  >
                    <Link href={`/account/${tx.signer}`} className="hover:underline">
                      {tx.signer.substring(0, 8)}
                    </Link>
                  </TableCell>
                )}
                {involved && (
                  <TableCell>
                    {tx.involved && (
                      <div className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                        tx.involved.type === 'INVOLVED' 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {tx.involved.type}
                      </div>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  {tx.actions.map(
                    (action, actionIndex) =>
                      action.inspection && (
                        <div
                          key={`${tx.id}-action-${actionIndex}`}
                          className="inline-flex items-center px-3 py-1 mx-1 text-xs rounded-full"
                          style={{
                            textTransform: 'none',
                            height: '26px',
                            fontWeight: 600,
                            letterSpacing: 0,
                            color: '#EBB077',
                            backgroundColor: '#FFFAF8',
                            padding: '0 12px'
                          }}
                        >
                          <button
                            type="button"
                            className="w-3 h-3 mr-1 text-orange-400 hover:text-orange-600"
                            aria-label="Filter by action type"
                            title="Filter by action type"
                          >
                            <svg
                              className="w-full h-full"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          {action.inspection.typeId}
                          {action.inspection.productType && (
                            <span style={{ fontSize: '10px', opacity: 0.8 }}>
                              ({action.inspection.productType})
                            </span>
                          )}
                        </div>
                      )
                  )}
                </TableCell>
                {detail && (
                  <TableCell className="text-gray-600">
                    {tx.actions[0]?.inspection?.amount && (
                      <AmountLabel
                        assetData={tx.actions[0].inspection.amount[0]}
                        amount={tx.actions[0].inspection.amount[1]}
                      />
                    )}
                  </TableCell>
                )}
                {(detail || embedMode) && (
                  <TableCell className="text-blue-600 hover:text-blue-800">
                    {tx.actions.map(
                      (action, actionIndex) =>
                        action.inspection?.avatarAddress && (
                          <Link
                            key={`${tx.id}-avatar-${actionIndex}`}
                            href={`/avatar/${action.inspection.avatarAddress}`}
                            className="mx-1 hover:underline"
                          >
                            {action.inspection.avatarAddress.substring(0, 8)}
                          </Link>
                        )
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
