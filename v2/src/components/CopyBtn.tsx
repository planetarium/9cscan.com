import { useState } from 'react';

interface CopyBtnProps {
  text: string;
  color?: string;
  textMode?: boolean;
  textColor?: string;
  depressed?: boolean;
  xSmall?: boolean;
  small?: boolean;
  large?: boolean;
  icon?: boolean;
  contentClass?: string;
  children?: React.ReactNode;
  onCopied?: (text: string) => void;
}

export default function CopyBtn({
  text,
  color = '#343434',
  textMode = false,
  textColor = '#C4C4C4',
  xSmall = false,
  small = false,
  large = false,
  icon = false,
  contentClass = '',
  children,
  onCopied,
}: CopyBtnProps) {
  const [copied, setCopied] = useState(false);

  const copyText = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onCopied?.(text);
        setTimeout(() => setCopied(false), 800);
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    }
  };

  const buttonClasses = [
    'font-bold font-sans',
    contentClass,
    {
      'text-white': !textMode,
      'bg-transparent': textMode,
      'px-2 py-1': small,
      'px-1 py-0.5': xSmall,
      'px-4 py-2': large,
      'rounded-full': icon,
      rounded: !icon,
    },
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={buttonClasses}
        style={{
          backgroundColor: textMode ? 'transparent' : color,
          color: textMode ? textColor : 'white',
          border: textMode ? `1px solid ${color}` : 'none',
        }}
        onClick={copyText}
      >
        {children}
      </button>

      {copied && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap z-50">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <strong>Copied</strong>
          </div>
        </div>
      )}
    </div>
  );
}
