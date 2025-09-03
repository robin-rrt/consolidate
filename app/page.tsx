'use client';
import TotalBalanceCard from "@/components/TotalBalanceCard";
import AssetBreakdownTable from "@/components/AssetBreakdownTable";
import TransactionsOverview from "@/components/TransactionsOverview";
import { useNexus } from '@avail-project/nexus-widgets';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';



export default function Home() {

  const { initializeSdk, sdk, isSdkInitialized } = useNexus();
  const { connector, isConnected } = useAccount();
  const { setProvider } = useNexus();

  useEffect(() => {
    if (isConnected && connector?.getProvider && !isSdkInitialized) {
      connector.getProvider().then(async (provider) => {
        await initializeSdk(provider as any);
      });
    }
  }, [isConnected, connector, isSdkInitialized]);

  

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2E2E2E] mb-2">Dashboard</h1>
        <p className="text-sm text-[#2E2E2E]/70">Manage your assets across multiple chains</p>
      </div>

      {/* Total Balance Card */}
      <div className="mb-6">
        <TotalBalanceCard />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Breakdown */}
        <AssetBreakdownTable />
        
        {/* Recent Transactions */}
        <TransactionsOverview />
      </div>
      <div className="flex-3 mt-8" style={{ padding: '5% 0%' }}>
        <p className="text-sm text-[#2E2E2E]/70" style={{ padding: '0%' }}>balances not loading? manually enable nexus below</p>
        <button 
          className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
            isSdkInitialized 
              ? 'bg-green-100 text-green-700 cursor-not-allowed' 
              : 'bg-[#2E2E2E] text-white hover:bg-[#2E2E2E]/90 hover:shadow-lg active:scale-95'
          }`}
          onClick={() => {
            if (isConnected && connector?.getProvider && !isSdkInitialized) {
              connector.getProvider().then(async (provider) => {
                await initializeSdk(provider as any);
              });
            }
          }} 
          disabled={isSdkInitialized}
        >
          {isSdkInitialized ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Nexus Functional
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Enable Nexus
            </>
          )}
        </button>
      </div>
    </div>
  );
}
