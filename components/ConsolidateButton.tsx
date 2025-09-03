'use client';

import Image from 'next/image';
import { BridgeButton } from '@avail-project/nexus-widgets';
import { Button } from './ui/button';

interface ConsolidateButtonProps {
  prefill: {
    token: string;
    amount: number | string;
  };
  isConnected: boolean;
  isLoading?: boolean;
}

export default function ConsolidateButton({ prefill, isConnected, isLoading = false }: ConsolidateButtonProps) {
  return (
    <div className="p-2 m-1"></div>
    <BridgeButton prefill={prefill as any}>
      {({ onClick, isLoading: bridgeLoading }) => (
        <Button
          onClick={onClick}
          disabled={!isConnected || bridgeLoading || isLoading}
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-colors ${
            isConnected 
              ? 'bg-[#2E2E2E] text-white hover:bg-[#2E2E2E]/90' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={{ padding: '2% 3%', margin: '1%' }}
        >
          <Image src="/consolidate.png" alt="consolidate" width={32} height={32} />
          CONSOLIDATE
        </Button>
      )}
    </BridgeButton>
  );
}
