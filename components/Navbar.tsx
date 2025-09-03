'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="h-14 bg-[#E1FFDD] flex justify-between items-center px-6 border-b border-[#2E2E2E]/10">
      <div className="flex items-center gap-1">
        <Image 
          src="/consolidate.png" 
          alt="Consolidate" 
          width={48} 
          height={48}
          className="flex-shrink-0 invert"
        />
        <div className="font-be-vietnam text-[#2E2E2E] text-xl font-bold tracking-wider">
          CONSOLIDATE
        </div>
      </div>
      <ConnectButton />
    </nav>
  );
}
