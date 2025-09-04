'use client';

import Image from 'next/image';
import { useUnifiedBalance } from '@/hooks/useUnifiedBalance';

export default function AssetBreakdownTable() {
  const { getChainsWithBalance, isLoading, isConnected } = useUnifiedBalance();

  return (
    <div className="bg-[#E1FFDD] p-6 rounded-lg shadow-sm" style={{ padding: '3%', margin: '1%' }}>
      <h2 className="text-[#2E2E2E] text-lg font-semibold mb-4">Asset Breakdown</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2E2E2E]/20">
              <th className="text-left py-2 px-2 text-sm font-medium text-[#2E2E2E]" style={{ padding: '1% 2%' }}>Chain</th>
              <th className="text-left py-2 px-2 text-sm font-medium text-[#2E2E2E]" style={{ padding: '1% 2%' }}>Network</th>
              <th className="text-left py-2 px-2 text-sm font-medium text-[#2E2E2E]" style={{ padding: '1% 2%' }}>USDC Balance</th>
              <th className="text-left py-2 px-2 text-sm font-medium text-[#2E2E2E]" style={{ padding: '1% 2%' }}>USD Value</th>
            </tr>
          </thead>
          <tbody>
            {!isConnected ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-[#2E2E2E]/50" style={{ padding: '4%' }}>
                  Connect your wallet to view your USDC balance across chains
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-[#2E2E2E]/50">
                  Loading...
                </td>
              </tr>
            ) : (
              getChainsWithBalance().map((item: { chain: { logo: string; name: string }; balance: string; balanceInFiat: number }, index: number) => (
                <tr key={index} className="border-b border-[#2E2E2E]/10 hover:bg-[#BEF3B8]/30">
                  <td className="py-3 px-2 text-sm text-[#2E2E2E]" style={{ padding: '1% 2%' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image 
                          src={item.chain.logo} 
                          alt={item.chain.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-[#2E2E2E] font-medium" style={{ padding: '1% 2%' }}>
                    {item.chain.name}
                  </td>
                  <td className="py-3 px-2 text-sm text-[#2E2E2E]" style={{ padding: '1% 2%' }}>
                    {parseFloat(item.balance).toFixed(6)} USDC
                  </td>
                  <td className="py-3 px-2 text-sm text-[#2E2E2E] font-medium" style={{ padding: '1% 2%' }}>
                    ${item.balanceInFiat.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {isConnected && !isLoading && getChainsWithBalance().length === 0 && (
        <div className="text-center py-8 text-[#2E2E2E]/50">
          No USDC balances found across chains
        </div>
      )}
    </div>
  );
}


