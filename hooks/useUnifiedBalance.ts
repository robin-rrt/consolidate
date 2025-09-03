import { useNexus } from '@avail-project/nexus-widgets';
import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';

export function useUnifiedBalance() {
  const { sdk, isSdkInitialized } = useNexus();
  const { isConnected } = useAccount();
  const [balanceData, setBalanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialFetch = useRef(true);

  const fetchBalance = async (isRefresh = false) => {
    if (isSdkInitialized && sdk && isConnected) {
      try {
        // Only show loading on initial fetch, not on refreshes
        if (!isRefresh) {
          setIsLoading(true);
        }
        setError(null);
        const balances = await sdk.getUnifiedBalance("USDC");
        console.log('Unified Balance Data:', balances);
        setBalanceData(balances || null);
      } catch (err) {
        console.error('Error fetching unified balance:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      } finally {
        if (!isRefresh) {
          setIsLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchBalance(false);

    // Set up interval for continuous refreshing (every 10 seconds)
    if (isSdkInitialized && sdk && isConnected) {
      intervalRef.current = setInterval(() => fetchBalance(true), 10000); // 10 seconds
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isSdkInitialized, sdk, isConnected]);

  // Helper functions for derived data
  const getTotalBalance = () => balanceData?.balance || '0';
  const getTotalBalanceInFiat = () => balanceData?.balanceInFiat || 0;
  const getChainsWithBalance = () => {
    if (!balanceData?.breakdown) return [];
    return balanceData.breakdown.filter((item: any) => parseFloat(item.balance) > 0);
  };
  const getChainCount = () => getChainsWithBalance().length;

  return {
    balanceData,
    isLoading,
    error,
    isConnected,
    getTotalBalance,
    getTotalBalanceInFiat,
    getChainsWithBalance,
    getChainCount,
  };
}
