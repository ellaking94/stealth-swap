import { useState, useEffect, useCallback } from 'react';
import { BridgeRecord, BridgeTransaction, BridgeFilter, BridgeStats } from '@/types/bridge';

// Mock data for demonstration
const mockBridgeRecords: BridgeRecord[] = [
  {
    transaction: {
      id: 'bridge-001',
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      amount: '1.5',
      sourceChain: {
        id: 1,
        name: 'Ethereum',
        symbol: 'ETH',
        icon: '/icons/ethereum.svg',
        explorerUrl: 'https://etherscan.io',
        rpcUrl: 'https://mainnet.infura.io',
        blockTime: 12
      },
      targetChain: {
        id: 137,
        name: 'Polygon',
        symbol: 'MATIC',
        icon: '/icons/polygon.svg',
        explorerUrl: 'https://polygonscan.com',
        rpcUrl: 'https://polygon-rpc.com',
        blockTime: 2
      },
      token: {
        address: '0xA0b86a33E6441c8C06DdD4C4c4c4c4c4c4c4c4c4c',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        icon: '/icons/usdc.svg',
        price: 1.0
      },
      status: 'completed',
      timestamp: Date.now() - 3600000, // 1 hour ago
      actualTime: 1800000, // 30 minutes
      fees: '0.05',
      privacyLevel: 'high',
      blockNumber: 18500000,
      gasUsed: '21000',
      gasPrice: '20000000000'
    },
    events: [
      {
        id: 'event-001',
        type: 'transaction_submitted',
        timestamp: Date.now() - 3600000,
        description: 'Transaction submitted to Ethereum network',
        chainId: 1,
        blockNumber: 18500000,
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678'
      },
      {
        id: 'event-002',
        type: 'transaction_confirmed',
        timestamp: Date.now() - 3300000,
        description: 'Transaction confirmed on Ethereum',
        chainId: 1,
        blockNumber: 18500000
      },
      {
        id: 'event-003',
        type: 'bridge_completed',
        timestamp: Date.now() - 1800000,
        description: 'Bridge completed successfully on Polygon',
        chainId: 137
      }
    ],
    privacySettings: {
      hideAmount: true,
      hideSender: false,
      hideRecipient: true,
      useZeroKnowledge: true,
      encryptionLevel: 'high'
    },
    userNotes: 'Monthly USDC transfer for expenses',
    tags: ['monthly', 'expenses'],
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1800000
  }
];

export const useBridgeHistory = () => {
  const [records, setRecords] = useState<BridgeRecord[]>(mockBridgeRecords);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all bridge records
  const getRecords = useCallback(async (filter?: BridgeFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredRecords = [...records];
      
      if (filter) {
        if (filter.status && filter.status.length > 0) {
          filteredRecords = filteredRecords.filter(record => 
            filter.status!.includes(record.transaction.status)
          );
        }
        
        if (filter.chains && filter.chains.length > 0) {
          filteredRecords = filteredRecords.filter(record => 
            filter.chains!.includes(record.transaction.sourceChain.id) ||
            filter.chains!.includes(record.transaction.targetChain.id)
          );
        }
        
        if (filter.tokens && filter.tokens.length > 0) {
          filteredRecords = filteredRecords.filter(record => 
            filter.tokens!.includes(record.transaction.token.symbol)
          );
        }
        
        if (filter.dateRange) {
          filteredRecords = filteredRecords.filter(record => 
            record.transaction.timestamp >= filter.dateRange!.start &&
            record.transaction.timestamp <= filter.dateRange!.end
          );
        }
        
        if (filter.searchTerm) {
          const searchLower = filter.searchTerm.toLowerCase();
          filteredRecords = filteredRecords.filter(record => 
            record.transaction.hash.toLowerCase().includes(searchLower) ||
            record.transaction.token.symbol.toLowerCase().includes(searchLower) ||
            record.transaction.sourceChain.name.toLowerCase().includes(searchLower) ||
            record.transaction.targetChain.name.toLowerCase().includes(searchLower) ||
            (record.userNotes && record.userNotes.toLowerCase().includes(searchLower))
          );
        }
      }
      
      setRecords(filteredRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bridge records');
    } finally {
      setLoading(false);
    }
  }, [records]);

  // Get bridge statistics
  const getStats = useCallback((): BridgeStats => {
    const totalTransactions = records.length;
    const successfulTransactions = records.filter(r => r.transaction.status === 'completed').length;
    const failedTransactions = records.filter(r => r.transaction.status === 'failed').length;
    
    const totalVolume = records
      .filter(r => r.transaction.status === 'completed')
      .reduce((sum, r) => sum + parseFloat(r.transaction.amount), 0)
      .toString();
    
    const completedRecords = records.filter(r => r.transaction.actualTime);
    const averageTime = completedRecords.length > 0 
      ? completedRecords.reduce((sum, r) => sum + (r.transaction.actualTime || 0), 0) / completedRecords.length
      : 0;
    
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;
    
    // Calculate favorite chains
    const chainCounts: Record<number, number> = {};
    records.forEach(record => {
      chainCounts[record.transaction.sourceChain.id] = (chainCounts[record.transaction.sourceChain.id] || 0) + 1;
      chainCounts[record.transaction.targetChain.id] = (chainCounts[record.transaction.targetChain.id] || 0) + 1;
    });
    
    const favoriteChains = Object.entries(chainCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([chainId]) => {
        const allChains = [...new Set(records.flatMap(r => [r.transaction.sourceChain, r.transaction.targetChain]))];
        return allChains.find(chain => chain.id === parseInt(chainId))!;
      });
    
    // Calculate favorite tokens
    const tokenCounts: Record<string, number> = {};
    records.forEach(record => {
      tokenCounts[record.transaction.token.symbol] = (tokenCounts[record.transaction.token.symbol] || 0) + 1;
    });
    
    const favoriteTokens = Object.entries(tokenCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([symbol]) => {
        const allTokens = [...new Set(records.map(r => r.transaction.token))];
        return allTokens.find(token => token.symbol === symbol)!;
      });
    
    // Calculate privacy usage
    const privacyUsage = records.reduce((acc, record) => {
      acc[record.transaction.privacyLevel] = (acc[record.transaction.privacyLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      totalVolume,
      averageTime,
      successRate,
      favoriteChains,
      favoriteTokens,
      privacyUsage
    };
  }, [records]);

  // Add new bridge record
  const addRecord = useCallback((transaction: BridgeTransaction, privacySettings: any, userNotes?: string) => {
    const newRecord: BridgeRecord = {
      transaction,
      events: [{
        id: `event-${Date.now()}`,
        type: 'transaction_submitted',
        timestamp: Date.now(),
        description: 'Transaction submitted',
        chainId: transaction.sourceChain.id,
        transactionHash: transaction.hash
      }],
      privacySettings,
      userNotes,
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setRecords(prev => [newRecord, ...prev]);
    return newRecord;
  }, []);

  // Update bridge record
  const updateRecord = useCallback((id: string, updates: Partial<BridgeRecord>) => {
    setRecords(prev => prev.map(record => 
      record.transaction.id === id 
        ? { ...record, ...updates, updatedAt: Date.now() }
        : record
    ));
  }, []);

  // Add event to bridge record
  const addEvent = useCallback((transactionId: string, event: any) => {
    setRecords(prev => prev.map(record => 
      record.transaction.id === transactionId 
        ? { 
            ...record, 
            events: [...record.events, { ...event, id: `event-${Date.now()}` }],
            updatedAt: Date.now()
          }
        : record
    ));
  }, []);

  // Delete bridge record
  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(record => record.transaction.id !== id));
  }, []);

  return {
    records,
    loading,
    error,
    getRecords,
    getStats,
    addRecord,
    updateRecord,
    addEvent,
    deleteRecord
  };
};
