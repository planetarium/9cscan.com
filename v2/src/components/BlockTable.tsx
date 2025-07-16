import { Link } from 'react-router-dom';
import { shortAddress, formatTimeAgo } from '@/utils/commonUtils';
import TableContainer from './common/TableContainer';
import TableHeader, { TableHeaderCell } from './common/TableHeader';
import TableRow, { TableCell } from './common/TableRow';

export interface Block {
  index: number;
  hash: string;
  timestamp: string;
  transactionCount: number;
  miner: string;
  stateRootHash: string;
}

export interface BlockTableProps {
  loading: boolean;
  blocks: Block[];
  detail?: boolean;
}

export default function BlockTable({ loading, blocks, detail = false }: BlockTableProps) {
  return (
    <TableContainer loading={loading} isEmpty={blocks.length === 0} emptyMessage="No Blocks">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader>
            <TableHeaderCell>Block</TableHeaderCell>
            {detail && <TableHeaderCell>Hash</TableHeaderCell>}
            <TableHeaderCell>Age</TableHeaderCell>
            <TableHeaderCell>Total Tx</TableHeaderCell>
            <TableHeaderCell>Miner</TableHeaderCell>
            {detail && <TableHeaderCell>State Root Hash</TableHeaderCell>}
          </TableHeader>
          <tbody>
            {blocks.map((block) => (
              <TableRow key={block.index}>
                <TableCell>
                  <Link
                    to={`/block/${block.index}`}
                    className="inline-block px-3 py-1 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    {block.index}
                  </Link>
                </TableCell>
                {detail && (
                  <TableCell className="text-gray-600 font-mono">
                    {shortAddress(block.hash)}
                  </TableCell>
                )}
                <TableCell className="text-gray-600 whitespace-nowrap">
                  {formatTimeAgo(block.timestamp)}
                </TableCell>
                <TableCell className="text-blue-600 hover:text-blue-800">
                  <a href={`/block/${block.index}#tx`} className="hover:underline">
                    {block.transactionCount}
                  </a>
                </TableCell>
                <TableCell className="text-blue-600 hover:text-blue-800">
                  <a href={`/account/${block.miner}?t=mined`} className="hover:underline">
                    {block.miner.substring(0, 8)}
                  </a>
                </TableCell>
                {detail && (
                  <TableCell className="text-gray-600 font-mono">
                    {shortAddress(block.stateRootHash)}
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
