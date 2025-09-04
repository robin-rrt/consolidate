import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { AssetTransfersResponse } from 'alchemy-sdk';

// Type for individual transfer objects from Alchemy API
export type Transfer = AssetTransfersResponse['transfers'][number] & {
  timestamp?: number;
  network?: string;
};

export interface TransferData {
  network: string;
  transfers: Transfer[];
  error?: string;
  pageKey?: string;
  hasMore: boolean;
}

export function useAlchemyTransfers() {
  const { address, isConnected } = useAccount();
  const [transfers, setTransfers] = useState<TransferData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransfers = async (address: string, pageKey?: string) => {
    try {
      const response = await fetch('/api/alchemy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          pageKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data.results;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch transfers');
    }
  };

  const fetchAllTransfers = async (isLoadMore = false) => {
    if (!address || !isConnected) {
      setTransfers([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const existingData = transfers.find(t => t.hasMore);
      const pageKey = isLoadMore ? existingData?.pageKey : undefined;
      
      const results = await fetchTransfers(address, pageKey);
      
      if (isLoadMore) {
        setTransfers(prev => prev.map(existing => {
          const newData = results.find((r: TransferData) => r.network === existing.network);
          if (newData) {
            return {
              ...existing,
              transfers: [...existing.transfers, ...newData.transfers],
              pageKey: newData.pageKey,
              hasMore: newData.hasMore,
            };
          }
          return existing;
        }));
      } else {
        setTransfers(results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transfers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchAllTransfers();
    }
  }, [address, isConnected]);

  const refetch = () => {
    fetchAllTransfers(false);
  };

  const loadMore = () => {
    fetchAllTransfers(true);
  };

  return {
    transfers,
    isLoading,
    error,
    refetch,
    loadMore,
  };
}