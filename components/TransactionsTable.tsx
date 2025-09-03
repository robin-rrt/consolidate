'use client';

import { useAlchemyTransfers } from '@/hooks/useAlchemy';
import { useAccount } from 'wagmi';
import { ArrowUpRight, ArrowDownLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TransactionsTable() {
  const { address, isConnected } = useAccount();
  const { transfers, isLoading, error, refetch, loadMore } = useAlchemyTransfers();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Reset to first page when new data is loaded
  useEffect(() => {
    setCurrentPage(1);
  }, [transfers.length]);

  // Get transfers from the single "All Networks" result (already sorted by time)
  const sortedTransfers = transfers.length > 0 ? transfers[0].transfers : [];

  // Calculate pagination
  const totalPages = Math.ceil(sortedTransfers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransfers = sortedTransfers.slice(startIndex, endIndex);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (value: number, asset: string) => {
    return `${value} ${asset}`;
  };

  const getExplorerUrl = (hash: string, network: string) => {
    switch (network) {
      case 'Ethereum':
        return `https://etherscan.io/tx/${hash}`;
      case 'Optimism':
        return `https://optimistic.etherscan.io/tx/${hash}`;
      case 'Base':
        return `https://basescan.org/tx/${hash}`;
      case 'Polygon':
        return `https://polygonscan.com/tx/${hash}`;
      case 'Arbitrum':
        return `https://arbiscan.io/tx/${hash}`;
      default:
        return `https://etherscan.io/tx/${hash}`;
    }
  };

  const formatTimestamp = (transfer: any) => {
    // Use the actual timestamp from the API
    const timestamp = transfer.timestamp || Date.now();
    const now = Date.now();
    const minutesAgo = Math.floor((now - timestamp) / (1000 * 60));
    
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    
    const hoursAgo = minutesAgo / 60;
    if (hoursAgo < 24) return `${Math.floor(hoursAgo)}h ago`;
    
    const daysAgo = hoursAgo / 24;
    if (daysAgo < 30) return `${Math.floor(daysAgo)}d ago`;
    
    const monthsAgo = daysAgo / 30;
    if (monthsAgo < 12) return `${Math.floor(monthsAgo)}mo ago`;
    
    const yearsAgo = monthsAgo / 12;
    return `${Math.floor(yearsAgo)}y ago`;
  };

  const hasMoreData = transfers.some(networkData => networkData.hasMore);
  return (
    <div className="bg-[#E1FFDD] p-6 rounded-lg shadow-sm h-full overflow-hidden" style={{ padding: '3%', margin: '1%' }}>
      {/* <h2 className="text-[#2E2E2E] text-lg font-semibold mb-4">Transactions</h2> */}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#2E2E2E] text-lg font-semibold">Deposits</h2>
        <div className="flex gap-2">
          <button
            onClick={refetch}
            disabled={isLoading}
            className="p-2 text-[#2E2E2E] hover:bg-[#BEF3B8] rounded-md transition-colors"
            title="Refresh transactions"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
          Error: {error}
        </div>
      )}

      {!isConnected && (
        <div className="text-center py-8 text-[#2E2E2E]/50">
          Connect your wallet to view deposits
        </div>
      )}

      {isConnected && (
        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-[800px] table-fixed">
            <thead>
              <tr className="border-b border-[#2E2E2E]/20">
                <th className="text-left py-2 px-3 text-sm font-medium text-[#2E2E2E] w-[100px]">Type</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-[#2E2E2E] w-[80px]">Asset</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-[#2E2E2E] w-[100px]">Amount</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-[#2E2E2E] w-[120px]">From</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-[#2E2E2E] w-[90px]">Network</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-[#2E2E2E] w-[80px]">Time</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-[#2E2E2E] w-[100px]">Hash</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && sortedTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#2E2E2E]/50">
                    Loading transactions...
                  </td>
                </tr>
              ) : currentTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#2E2E2E]/50">
                    No transactions found
                  </td>
                </tr>
              ) : (
                currentTransfers.map((tx) => (
                  <tr key={tx.uniqueId} className="border-b border-[#2E2E2E]/10 hover:bg-[#BEF3B8]/30">
                    <td className="py-3 px-3 text-sm">
                      <div className="flex items-center gap-2">
                        <ArrowDownLeft size={16} className="text-green-600 flex-shrink-0" />
                        <span className="font-medium text-green-600 truncate">Received</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-[#2E2E2E] font-medium">
                      <span className="truncate block" title={tx.asset}>{tx.asset}</span>
                    </td>
                    <td className="py-3 px-3 text-sm text-[#2E2E2E] font-medium">
                      <span className="truncate block" title={formatAmount(tx.value, tx.asset)}>
                        {formatAmount(tx.value, tx.asset)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm text-[#2E2E2E] font-mono">
                      <span className="truncate block" title={tx.from}>
                        {formatAddress(tx.from)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm text-[#2E2E2E]">
                      <span className="truncate block" title={tx.network}>{tx.network}</span>
                    </td>
                    <td className="py-3 px-3 text-sm text-[#2E2E2E]">
                      <span className="truncate block" title={formatTimestamp(tx)}>
                        {formatTimestamp(tx)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm">
                      <a
                        href={getExplorerUrl(tx.hash, tx.network)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title={`View transaction on ${tx.network}: ${tx.hash}`}
                      >
                        <span className="font-mono text-xs truncate">
                          {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                        </span>
                        <ExternalLink size={12} className="flex-shrink-0" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {sortedTransfers.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-[#2E2E2E]/60">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedTransfers.length)} of {sortedTransfers.length} transactions
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-[#2E2E2E] text-white rounded-md hover:bg-[#2E2E2E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-[#2E2E2E]">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-[#2E2E2E] text-white rounded-md hover:bg-[#2E2E2E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Load More Button for API Pagination */}
      {hasMoreData && sortedTransfers.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-[#2E2E2E] text-white rounded-md hover:bg-[#2E2E2E]/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More from API'}
          </button>
        </div>
      )}
    </div>
  );
}


