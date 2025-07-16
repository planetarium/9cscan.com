interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export default function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead>
      <tr className={`border-b border-gray-200 ${className}`}>{children}</tr>
    </thead>
  );
}

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeaderCell({ children, className = '' }: TableHeaderCellProps) {
  return (
    <th className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${className}`}>
      {children}
    </th>
  );
}
