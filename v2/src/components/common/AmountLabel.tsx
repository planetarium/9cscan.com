interface AmountLabelProps {
  assetData?: {
    ticker?: string;
    decimalPlaces?: number;
  };
  amount?: number;
  minus?: boolean;
}

export default function AmountLabel({ assetData, amount, minus = false }: AmountLabelProps) {
  const ticker = assetData?.ticker || '';
  const decimal = Number(assetData?.decimalPlaces ?? 0);
  
  let displayAmount = (amount || 0) * (minus ? -1 : 1);
  if (decimal > 0) {
    displayAmount /= Math.pow(10, decimal);
  }

  return (
    <span className="amount" style={{ color: '#444', fontWeight: 500 }}>
      {displayAmount.toFixed(2)} <span className="ticker" style={{ color: '#666' }}>{ticker}</span>
    </span>
  );
} 