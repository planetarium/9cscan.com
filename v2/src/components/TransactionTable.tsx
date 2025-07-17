import { shortAddress, formatTimeAgo } from '@/utils/commonUtils';
import TableContainer from './common/TableContainer';
import TableHeader, { TableHeaderCell } from './common/TableHeader';
import TableRow, { TableCell } from './common/TableRow';
import Badge from './common/Badge';
import Link from './common/Link';

export interface Action {
  inspection?: {
    typeId: string;
    productType?: string;
    amount?: string;
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
    <TableContainer
      loading={loading}
      isEmpty={transactions.length === 0}
      emptyMessage="No Transactions"
    >
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
            {detail && <TableHeaderCell>Details</TableHeaderCell>}
            {(detail || embedMode) && <TableHeaderCell>Avatar</TableHeaderCell>}
          </TableHeader>
          <tbody>
            {transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-blue-600 hover:text-blue-800">
                  <Link href={`/transaction/${tx.id}`} className="hover:underline">
                    {shortAddress(tx.id, 4, 4)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/block/${tx.blockIndex}`}
                    className="inline-block px-3 py-1 text-sm bg-blue-50 text-[#53acd3] border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    {tx.blockIndex}
                  </Link>
                </TableCell>
                <TableCell className="text-gray-600 whitespace-nowrap">
                  {formatTimeAgo(tx.blockTimestamp || tx.timestamp)}
                </TableCell>
                {detail && (
                  <TableCell>
                    <Badge variant="default" size="sm">
                      <strong className="mr-1">{latestBlockIndex - tx.blockIndex + 1}</strong>
                      Confirms
                    </Badge>
                  </TableCell>
                )}
                {!embedMode && (
                  <TableCell className="text-blue-600 hover:text-blue-800">
                    <Link href={`/account/${tx.signer}`} className="hover:underline">
                      {tx.signer.substring(0, 8)}
                    </Link>
                  </TableCell>
                )}
                {involved && (
                  <TableCell>
                    {tx.involved && (
                      <Badge
                        variant={tx.involved.type === 'INVOLVED' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {tx.involved.type}
                      </Badge>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  {tx.actions.map(
                    (action, actionIndex) =>
                      action.inspection && (
                        <div
                          key={`${tx.id}-action-${actionIndex}`}
                          className="inline-flex items-center px-3 py-1 mx-1 text-xs bg-orange-50 text-orange-600 border border-orange-200 rounded-full"
                        >
                          <button
                            type="button"
                            className="w-3 h-3 mr-1 text-orange-600 hover:text-orange-800"
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
                            <span className="text-xs opacity-80 ml-1">
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
                      <span>Amount: {tx.actions[0].inspection.amount}</span>
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
    </TableContainer>
  );
}
