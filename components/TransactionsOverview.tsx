'use client';

import { useAlchemyTransfers } from '@/hooks/useAlchemy';
import { useAccount } from 'wagmi';
import { ArrowDownLeft, ArrowUpRight, ExternalLink } from 'lucide-react';

export default function TransactionsOverview() {
  const { address, isConnected } = useAccount();
  const { transfers, isLoading, error } = useAlchemyTransfers();

  // Get transfers from the single "All Networks" result (already sorted by time) and take only top 5
  const top5Transfers = transfers.length > 0 ? transfers[0].transfers.slice(0, 5) : [];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (value: number, asset: string) => {
    return `${value} ${asset}`;
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

  return (
    <div className="bg-[#E1FFDD] p-6 rounded-lg shadow-sm h-full" style={{ padding: '3%', margin: '1%' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#2E2E2E] text-lg font-semibold">Recent Deposits</h2>
        <span className="text-sm text-[#2E2E2E]/60">Top 5</span>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2E2E2E]/20">
                <th className="text-left py-2 px-2 text-sm font-medium text-[#2E2E2E]" style={{ padding: '1% 2%' }}>Type</th>
                <th className="text-left py-2 px-2 text-sm font-medium text-[#2E2E2E]" style={{ padding: '1% 2%' }}>Asset</th>
                <th className="text-left py-2 px-2 text-sm font-medium text-[#2E2E2E]" style={{ padding: '1% 2%' }}>Amount</th>
                <th className="text-left py-2 px-2 text-sm font-medium text-[#2E2E2E]" style={{ padding: '1% 2%' }}>Network</th>
                <th className="text-left py-2 px-2 text-sm font-medium text-[#2E2E2E]" style={{ padding: '1% 2%' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && top5Transfers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#2E2E2E]/50">
                    Loading transactions...
                  </td>
                </tr>
              ) : top5Transfers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#2E2E2E]/50">
                    No transactions found
                  </td>
                </tr>
              ) : (
                top5Transfers.map((tx) => (
                  <tr key={tx.uniqueId} className="border-b border-[#2E2E2E]/10 hover:bg-[#BEF3B8]/30">
                    <td className="py-3 px-2 text-sm" style={{ padding: '1% 2%' }}>
                      <div className="flex items-center gap-2">
                        <ArrowDownLeft size={16} className="text-green-600" />
                        <span className="font-medium text-green-600">Received</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-[#2E2E2E] font-medium" style={{ padding: '1% 2%' }}>
                      {tx.asset}
                    </td>
                    <td className="py-3 px-2 text-sm text-[#2E2E2E] font-medium" style={{ padding: '1% 2%' }}>
                      {formatAmount(tx.value, tx.asset)}
                    </td>
                    <td className="py-3 px-2 text-sm text-[#2E2E2E]" style={{ padding: '1% 2%' }}>
                      {tx.network}
                    </td>
                    <td className="py-3 px-2 text-sm text-[#2E2E2E]" style={{ padding: '1% 2%' }}>
                      {formatTimestamp(tx)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {top5Transfers.length > 0 && (
        <div className="mt-4 text-center">
          <a
            href="/transactions"
            className="inline-flex items-center gap-1 px-4 py-2 text-sm text-[#2E2E2E] bg-white border border-[#2E2E2E]/20 rounded-md hover:bg-[#2E2E2E]/5 transition-colors"
          >
            View all deposits
            <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </div>
  );
}
