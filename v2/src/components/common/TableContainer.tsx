import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

interface TableContainerProps {
  loading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
  className?: string;
}

export default function TableContainer({
  loading,
  isEmpty,
  emptyMessage,
  children,
  className = '',
}: TableContainerProps) {
  if (loading) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="h-2 bg-blue-600 animate-pulse" />
        <div className="h-96 bg-white flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="h-2 bg-blue-600" />
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      <div className="h-2 bg-blue-600" />
      {children}
    </div>
  );
}
