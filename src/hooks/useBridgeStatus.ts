import { useState, useEffect, useCallback } from 'react';
import { BridgeTransaction, BridgeEvent, BridgeStatus } from '@/types/bridge';
import { useAccount } from 'wagmi';

interface UseBridgeStatusProps {
  transactionId?: string;
}

export const useBridgeStatus = ({ transactionId }: UseBridgeStatusProps) => {
  const { address } = useAccount();
  const [currentTransaction, setCurrentTransaction] = useState<BridgeTransaction | null>(null);
  const [events, setEvents] = useState<BridgeEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate real-time status updates
  const updateTransactionStatus = useCallback(async (txId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call to get transaction status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock status progression
      const statuses: BridgeStatus[] = ['pending', 'confirmed', 'bridging', 'settling', 'completed'];
      const currentIndex = Math.floor(Math.random() * statuses.length);
      const newStatus = statuses[currentIndex];
      
      // Update transaction status
      setCurrentTransaction(prev => prev ? {
        ...prev,
        status: newStatus,
        updatedAt: Date.now()
      } : null);

      // Add new event
      const newEvent: BridgeEvent = {
        id: `event-${Date.now()}`,
        type: getEventTypeFromStatus(newStatus),
        timestamp: Date.now(),
        description: getEventDescription(newStatus),
        chainId: currentTransaction?.sourceChain.id || 1,
        transactionHash: currentTransaction?.hash
      };

      setEvents(prev => [newEvent, ...prev]);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setLoading(false);
    }
  }, [currentTransaction]);

  // Start monitoring a transaction
  const startMonitoring = useCallback((transaction: BridgeTransaction) => {
    setCurrentTransaction(transaction);
    setEvents([{
      id: `event-${Date.now()}`,
      type: 'transaction_submitted',
      timestamp: Date.now(),
      description: 'Transaction submitted to network',
      chainId: transaction.sourceChain.id,
      transactionHash: transaction.hash
    }]);

    // Start periodic status updates
    const interval = setInterval(() => {
      updateTransactionStatus(transaction.id);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [updateTransactionStatus]);

  // Get estimated completion time
  const getEstimatedTime = useCallback((status: BridgeStatus): number => {
    const timeEstimates: Record<BridgeStatus, number> = {
      pending: 300000,    // 5 minutes
      confirmed: 600000,  // 10 minutes
      bridging: 900000,   // 15 minutes
      settling: 300000,   // 5 minutes
      completed: 0,
      failed: 0,
      cancelled: 0,
      expired: 0
    };
    
    return timeEstimates[status] || 0;
  }, []);

  // Check if transaction is in progress
  const isInProgress = useCallback((status: BridgeStatus): boolean => {
    return ['pending', 'confirmed', 'bridging', 'settling'].includes(status);
  }, []);

  // Get progress percentage
  const getProgress = useCallback((status: BridgeStatus): number => {
    const statusOrder = ['pending', 'confirmed', 'bridging', 'settling', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  }, []);

  // Auto-refresh when transaction is in progress
  useEffect(() => {
    if (currentTransaction && isInProgress(currentTransaction.status)) {
      const interval = setInterval(() => {
        updateTransactionStatus(currentTransaction.id);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [currentTransaction, isInProgress, updateTransactionStatus]);

  return {
    currentTransaction,
    events,
    loading,
    error,
    startMonitoring,
    updateTransactionStatus,
    getEstimatedTime,
    isInProgress,
    getProgress
  };
};

// Helper functions
function getEventTypeFromStatus(status: BridgeStatus): BridgeEvent['type'] {
  switch (status) {
    case 'pending':
      return 'transaction_submitted';
    case 'confirmed':
      return 'transaction_confirmed';
    case 'bridging':
      return 'bridge_processing';
    case 'settling':
      return 'settlement_started';
    case 'completed':
      return 'bridge_completed';
    case 'failed':
      return 'bridge_failed';
    case 'cancelled':
      return 'bridge_cancelled';
    default:
      return 'status_changed';
  }
}

function getEventDescription(status: BridgeStatus): string {
  switch (status) {
    case 'pending':
      return 'Transaction submitted and waiting for confirmation';
    case 'confirmed':
      return 'Transaction confirmed on source chain';
    case 'bridging':
      return 'Cross-chain bridge processing initiated';
    case 'settling':
      return 'Settlement in progress on target chain';
    case 'completed':
      return 'Bridge completed successfully';
    case 'failed':
      return 'Bridge transaction failed';
    case 'cancelled':
      return 'Bridge transaction cancelled';
    default:
      return 'Transaction status updated';
  }
}
