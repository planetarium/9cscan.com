interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function TableRow({ children, className = '', onClick }: TableRowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <tr
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TableCell({ children, className = '', style }: TableCellProps) {
  return (
    <td className={`px-4 py-3 text-sm text-center ${className}`} style={style}>
      {children}
    </td>
  );
}
