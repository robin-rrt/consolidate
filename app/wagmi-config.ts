'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, avalanche, bsc, sophon, kaia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Consolidate Dashboard',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "", // You'll need to replace this with your actual project ID
  chains: [mainnet, polygon, optimism, arbitrum, base, avalanche, bsc, sophon, kaia],
  ssr: true,
});


