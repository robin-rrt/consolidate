'use client';

import Image from 'next/image';
import { QrCode, Send, Copy, Check } from 'lucide-react';
import { useUnifiedBalance } from '@/hooks/useUnifiedBalance';
import {
  BridgeButton,
  TransferButton,
} from '@avail-project/nexus-widgets';
import { Button } from './ui/button';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';


export default function TotalBalanceCard() {
  const { getTotalBalance, getChainCount, isLoading, isConnected } = useUnifiedBalance();
  const { address } = useAccount();
  const [showQRCode, setShowQRCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConsolidate = () => {
    console.log('Consolidate button clicked');
  };

  const handleReceive = () => {
    if (address) {
      setShowQRCode(true);
    }
  };

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const handleSend = () => {
    console.log('Send button clicked');
  };

  return (
    <div className="bg-[#E1FFDD] p-6 rounded-lg shadow-sm" style={{ padding: '3%', margin: '1%' }}>
      <h2 className="text-[#2E2E2E] text-lg font-semibold mb-4">Total Balance</h2>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-5xl font-bold text-[#2E2E2E] mb-1">
            {!isConnected ? '-' : 
              isLoading ? 'Loading...' : `$${getTotalBalance()}`
            }
          </div>
          <div className="text-sm text-[#2E2E2E]/70">
            {!isConnected ? '' : `across ${getChainCount()} chains`}
          </div>
        </div>
        <div className="mx-5">
          <BridgeButton prefill={{ token: 'USDC' }}>
          {({ onClick, isLoading: bridgeLoading }) => (
        <Button
          onClick={onClick}
          disabled={!isConnected || bridgeLoading || isLoading}
          className={`flex items-center gap-2 rounded-md px-20 py-10 font-medium text-lg transition-colors ${
            isConnected 
              ? 'bg-[#2E2E2E] text-white hover:bg-[#2E2E2E]/90' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={{ padding: '6% 15%' }}
        >
          <Image src="/consolidate.png" alt="consolidate" width={32} height={32} />
          CONSOLIDATE
        </Button>
      )}
        </BridgeButton>
        </div>

      </div>
      
      <div className="flex gap-1">
        <TransferButton prefill={{ token: 'USDC' }}>
        {({ onClick, isLoading: transferLoading }) => (
        <Button
          onClick={onClick}
          disabled={!isConnected || transferLoading || isLoading}
          className={`rounded-md px-4 py-2 font-medium text-sm flex items-center gap-2 transition-colors border ${
            isConnected 
              ? 'bg-white text-[#2E2E2E] hover:bg-gray-50 border-[#2E2E2E]/20' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
          }`} 
          style={{ padding: '1% 2%' }}
        >
                     <div style={{ padding: '0% 0% 0% 5%' }}> <Send size={24} /> </div> 
           
          <div  className='px-2' > Send </div> 
        </Button>
        )}
        </TransferButton>
        
        <Button
          onClick={handleReceive}
          disabled={!isConnected}
          className={`rounded-md px-4 py-2 font-medium text-sm flex items-center gap-2 transition-colors border ${
            isConnected 
              ? 'bg-white text-[#2E2E2E] hover:bg-gray-50 border-[#2E2E2E]/20' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
          }`} 
          style={{ padding: '1% 2%'}}
        >
          <QrCode size={24} />
          Receive
        </Button>
      </div>

      {/* QR Code Modal */}
      <Dialog.Root open={showQRCode} onOpenChange={setShowQRCode}>
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </Dialog.Overlay>
          <Dialog.Content asChild>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="bg-white rounded-lg shadow-xl max-w-sm w-full border">
                <div className="flex justify-between items-center p-6 pb-4">
                  <Dialog.Title className="text-lg font-semibold text-[#2E2E2E]">
                    Receive Address
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors">
                      ✕
                    </button>
                  </Dialog.Close>
                </div>
                <div className="px-6 pb-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <QRCode
                        value={address || ''}
                        size={200}
                        level="H"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Your wallet address:</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-xs font-mono text-[#2E2E2E] break-all max-w-[200px]">
                          {address}
                        </p>
                        <button
                          onClick={handleCopyAddress}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy address"
                        >
                          {copied ? (
                            <Check size={16} className="text-green-600" />
                          ) : (
                            <Copy size={16} className="text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}


