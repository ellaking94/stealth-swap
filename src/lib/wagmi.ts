import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, arbitrum, optimism } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Stealth Swap',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'placeholder-project-id-for-testing',
  chains: [mainnet, sepolia, polygon, arbitrum, optimism],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
