import { useState, useEffect } from 'react';
import { BridgeTransaction, BridgeEvent, BridgeEventType } from '@/types/bridge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Shield, 
  ArrowRight,
  ExternalLink,
  Copy,
  RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface BridgeStatusTrackerProps {
  transaction: BridgeTransaction;
  events: BridgeEvent[];
  onRefresh?: () => void;
  className?: string;
}

const statusSteps = [
  { key: 'pending', label: 'Transaction Submitted', description: 'Waiting for confirmation' },
  { key: 'confirmed', label: 'Source Confirmed', description: 'Confirmed on source chain' },
  { key: 'bridging', label: 'Bridge Processing', description: 'Cross-chain transfer in progress' },
  { key: 'settling', label: 'Settlement', description: 'Settling on target chain' },
  { key: 'completed', label: 'Completed', description: 'Successfully completed' }
];

const eventIcons: Record<BridgeEventType, React.ReactNode> = {
  transaction_submitted: <Clock className="h-4 w-4 text-blue-500" />,
  transaction_confirmed: <CheckCircle className="h-4 w-4 text-green-500" />,
  bridge_initiated: <ArrowRight className="h-4 w-4 text-purple-500" />,
  bridge_processing: <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />,
  settlement_started: <Shield className="h-4 w-4 text-indigo-500" />,
  settlement_confirmed: <CheckCircle className="h-4 w-4 text-green-500" />,
  bridge_completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  bridge_failed: <AlertCircle className="h-4 w-4 text-red-500" />,
  bridge_cancelled: <AlertCircle className="h-4 w-4 text-orange-500" />,
  privacy_updated: <Shield className="h-4 w-4 text-blue-500" />,
  status_changed: <RefreshCw className="h-4 w-4 text-gray-500" />
};

export const BridgeStatusTracker = ({ 
  transaction, 
  events, 
  onRefresh, 
  className 
}: BridgeStatusTrackerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    // Calculate current step based on transaction status
    const stepIndex = statusSteps.findIndex(step => step.key === transaction.status);
    setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
    
    // Calculate progress percentage
    const progressPercentage = ((stepIndex + 1) / statusSteps.length) * 100;
    setProgress(progressPercentage);

    // Calculate estimated time remaining
    if (transaction.status !== 'completed' && transaction.status !== 'failed') {
      const elapsed = Date.now() - transaction.timestamp;
      const estimatedTotal = transaction.estimatedTime || 1800000; // 30 minutes default
      const remaining = Math.max(0, estimatedTotal - elapsed);
      setEstimatedTimeRemaining(remaining);
    } else {
      setEstimatedTimeRemaining(null);
    }
  }, [transaction.status, transaction.timestamp, transaction.estimatedTime]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
      case 'bridging':
      case 'settling':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast('Transaction hash copied to clipboard');
  };

  const formatTimeRemaining = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Transaction Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Bridge Transaction Status
              </CardTitle>
              <CardDescription>
                Track your cross-chain bridge progress
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={transaction.status === 'completed' || transaction.status === 'failed'}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Badge className={`${getStatusColor(transaction.status)} bg-opacity-20`}>
                {transaction.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {transaction.hash.substring(0, 10)}...{transaction.hash.substring(-8)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(transaction.hash)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Amount</p>
              <p className="font-medium">
                {transaction.privacyLevel === 'maximum' ? '***' : `${transaction.amount} ${transaction.token.symbol}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Started</p>
              <p className="font-medium">
                {formatDistanceToNow(transaction.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Bridge Progress</CardTitle>
          <CardDescription>
            {estimatedTimeRemaining && transaction.status !== 'completed' && transaction.status !== 'failed' && (
              <span className="text-yellow-600">
                Estimated time remaining: {formatTimeRemaining(estimatedTimeRemaining)}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="h-2" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {statusSteps.map((step, index) => {
                const stepStatus = getStepStatus(index);
                return (
                  <div
                    key={step.key}
                    className={`text-center p-4 rounded-lg border-2 transition-all ${
                      stepStatus === 'completed'
                        ? 'border-green-500 bg-green-500/10'
                        : stepStatus === 'current'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      {stepStatus === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : stepStatus === 'current' ? (
                        <Clock className="h-6 w-6 text-blue-500" />
                      ) : (
                        <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <h4 className={`font-medium text-sm ${
                      stepStatus === 'completed' ? 'text-green-700' :
                      stepStatus === 'current' ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chain Information */}
      <Card>
        <CardHeader>
          <CardTitle>Chain Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <img 
                  src={transaction.sourceChain.icon} 
                  alt={transaction.sourceChain.name}
                  className="w-8 h-8 rounded-full mx-auto mb-2"
                />
                <p className="font-medium text-sm">{transaction.sourceChain.name}</p>
                <p className="text-xs text-muted-foreground">Source Chain</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="text-center">
                <img 
                  src={transaction.targetChain.icon} 
                  alt={transaction.targetChain.name}
                  className="w-8 h-8 rounded-full mx-auto mb-2"
                />
                <p className="font-medium text-sm">{transaction.targetChain.name}</p>
                <p className="text-xs text-muted-foreground">Target Chain</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(
                  `${transaction.sourceChain.explorerUrl}/tx/${transaction.hash}`,
                  '_blank'
                )}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on {transaction.sourceChain.name}
              </Button>
              {transaction.status === 'completed' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(
                    `${transaction.targetChain.explorerUrl}/tx/${transaction.hash}`,
                    '_blank'
                  )}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on {transaction.targetChain.name}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Timeline</CardTitle>
          <CardDescription>
            Real-time updates of your bridge transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((event, index) => (
                <div key={event.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {eventIcons[event.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    {event.chainId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Chain ID: {event.chainId}
                        {event.blockNumber && ` • Block: ${event.blockNumber}`}
                      </p>
                    )}
                    {event.transactionHash && (
                      <div className="flex items-center gap-2 mt-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {event.transactionHash.substring(0, 10)}...{event.transactionHash.substring(-8)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(event.transactionHash!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
