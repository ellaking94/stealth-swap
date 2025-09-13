import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { sepolia, mainnet, polygon, arbitrum, optimism } from 'viem/chains';

// Contract addresses (these would be deployed addresses)
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: '0x...', // StealthSwap contract address on Sepolia
  [mainnet.id]: '0x...', // StealthSwap contract address on Mainnet
  [polygon.id]: '0x...', // StealthSwap contract address on Polygon
  [arbitrum.id]: '0x...', // StealthSwap contract address on Arbitrum
  [optimism.id]: '0x...', // StealthSwap contract address on Optimism
};

// Contract ABI (simplified for demonstration)
export const STEALTH_SWAP_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "requestId",
        "type": "uint256"
      }
    ],
    "name": "getSwapRequestInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "sourceChainId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "targetChainId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "sourceToken",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "targetToken",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "bridgeId",
        "type": "uint256"
      }
    ],
    "name": "getBridgeTransactionInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "sourceChainId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "targetChainId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isProcessed",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isSettled",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "merkleProof",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserPrivacySettings",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "privacyLevel",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "hideAmount",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "hideSender",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "hideRecipient",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "useZeroKnowledge",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Chain configurations
export const CHAINS = {
  [sepolia.id]: sepolia,
  [mainnet.id]: mainnet,
  [polygon.id]: polygon,
  [arbitrum.id]: arbitrum,
  [optimism.id]: optimism,
};

// Helper function to get contract address for a chain
export function getContractAddress(chainId: number): `0x${string}` {
  const address = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!address) {
    throw new Error(`Contract not deployed on chain ${chainId}`);
  }
  return address as `0x${string}`;
}

// Helper function to create public client for a chain
export function createChainClient(chainId: number) {
  const chain = CHAINS[chainId as keyof typeof CHAINS];
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }
  
  return createPublicClient({
    chain,
    transport: http(),
  });
}

// Helper function to create wallet client for a chain
export function createChainWalletClient(chainId: number, transport: any) {
  const chain = CHAINS[chainId as keyof typeof CHAINS];
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainId}`);
  }
  
  return createWalletClient({
    chain,
    transport,
  });
}

// Contract interaction helpers
export async function getSwapRequestInfo(chainId: number, requestId: bigint) {
  const client = createChainClient(chainId);
  const contractAddress = getContractAddress(chainId);
  
  return await client.readContract({
    address: contractAddress,
    abi: STEALTH_SWAP_ABI,
    functionName: 'getSwapRequestInfo',
    args: [requestId],
  });
}

export async function getBridgeTransactionInfo(chainId: number, bridgeId: bigint) {
  const client = createChainClient(chainId);
  const contractAddress = getContractAddress(chainId);
  
  return await client.readContract({
    address: contractAddress,
    abi: STEALTH_SWAP_ABI,
    functionName: 'getBridgeTransactionInfo',
    args: [bridgeId],
  });
}

export async function getUserPrivacySettings(chainId: number, userAddress: `0x${string}`) {
  const client = createChainClient(chainId);
  const contractAddress = getContractAddress(chainId);
  
  return await client.readContract({
    address: contractAddress,
    abi: STEALTH_SWAP_ABI,
    functionName: 'getUserPrivacySettings',
    args: [userAddress],
  });
}
