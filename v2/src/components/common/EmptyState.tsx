interface EmptyStateProps {
  message: string;
  className?: string;
}

export default function EmptyState({ message, className = '' }: EmptyStateProps) {
  return (
    <div className={`h-96 bg-white flex items-center justify-center ${className}`}>
      <span className="text-gray-500">{message}</span>
    </div>
  );
}
