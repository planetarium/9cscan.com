import { useState, useEffect } from 'react';
import { useGetWncgPriceQuery } from '@/graphql-mimir/generated/graphql';

interface WNCGData {
  price: number;
  marketCap: number;
  percentChange24h: number;
}

export const useWNCG = () => {
  const [wncgData, setWncgData] = useState<WNCGData>({
    price: 0,
    marketCap: 0,
    percentChange24h: 0,
  });

  const { data, loading, error } = useGetWncgPriceQuery({
    pollInterval: 60000,
  });

  useEffect(() => {
    if (data?.wncgPrice?.quote?.usd) {
      const usd = data.wncgPrice.quote.usd;
      setWncgData({
        price: usd.price || 0,
        marketCap: usd.marketCap || 0,
        percentChange24h: usd.percentChange24h || 0,
      });
    }
  }, [data]);

  return {
    wncgData,
    loading,
    error,
  };
}; 