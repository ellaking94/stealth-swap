// Bridge transaction types and interfaces

export interface BridgeTransaction {
  id: string;
  hash: string;
  amount: string;
  sourceChain: ChainInfo;
  targetChain: ChainInfo;
  token: TokenInfo;
  status: BridgeStatus;
  timestamp: number;
  estimatedTime?: number;
  actualTime?: number;
  fees?: string;
  recipient?: string;
  privacyLevel: PrivacyLevel;
  encryptedAmount?: string;
  merkleProof?: string;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
}

export interface ChainInfo {
  id: number;
  name: string;
  symbol: string;
  icon: string;
  explorerUrl: string;
  rpcUrl: string;
  blockTime: number;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  icon: string;
  price?: number;
}

export type BridgeStatus = 
  | 'pending'           // Transaction submitted, waiting for confirmation
  | 'confirmed'         // Transaction confirmed on source chain
  | 'bridging'          // Being processed by bridge
  | 'settling'          // Settlement in progress on target chain
  | 'completed'         // Successfully completed
  | 'failed'            // Transaction failed
  | 'cancelled'         // Transaction cancelled by user
  | 'expired';          // Transaction expired

export type PrivacyLevel = 'low' | 'medium' | 'high' | 'maximum';

export interface BridgeRecord {
  transaction: BridgeTransaction;
  events: BridgeEvent[];
  privacySettings: PrivacySettings;
  userNotes?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface BridgeEvent {
  id: string;
  type: BridgeEventType;
  timestamp: number;
  description: string;
  data?: Record<string, any>;
  chainId?: number;
  blockNumber?: number;
  transactionHash?: string;
}

export type BridgeEventType = 
  | 'transaction_submitted'
  | 'transaction_confirmed'
  | 'bridge_initiated'
  | 'bridge_processing'
  | 'settlement_started'
  | 'settlement_confirmed'
  | 'bridge_completed'
  | 'bridge_failed'
  | 'bridge_cancelled'
  | 'privacy_updated'
  | 'status_changed';

export interface PrivacySettings {
  hideAmount: boolean;
  hideSender: boolean;
  hideRecipient: boolean;
  useZeroKnowledge: boolean;
  encryptionLevel: PrivacyLevel;
  customPrivacyRules?: Record<string, any>;
}

export interface BridgeStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalVolume: string;
  averageTime: number;
  successRate: number;
  favoriteChains: ChainInfo[];
  favoriteTokens: TokenInfo[];
  privacyUsage: Record<PrivacyLevel, number>;
}

export interface BridgeFilter {
  status?: BridgeStatus[];
  chains?: number[];
  tokens?: string[];
  dateRange?: {
    start: number;
    end: number;
  };
  privacyLevel?: PrivacyLevel[];
  searchTerm?: string;
}

export interface BridgeNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  transactionId?: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}
