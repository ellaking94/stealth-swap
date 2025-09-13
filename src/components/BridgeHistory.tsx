import { useState } from 'react';
import { useBridgeHistory } from '@/hooks/useBridgeHistory';
import { BridgeRecord, BridgeFilter, BridgeStatus } from '@/types/bridge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  ExternalLink,
  Copy,
  MoreHorizontal
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface BridgeHistoryProps {
  className?: string;
}

export const BridgeHistory = ({ className }: BridgeHistoryProps) => {
  const { records, loading, getRecords, getStats } = useBridgeHistory();
  const [filter, setFilter] = useState<BridgeFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BridgeStatus | 'all'>('all');

  const stats = getStats();

  const handleSearch = () => {
    getRecords({
      ...filter,
      searchTerm: searchTerm || undefined
    });
  };

  const handleStatusFilter = (status: BridgeStatus | 'all') => {
    setSelectedStatus(status);
    getRecords({
      ...filter,
      status: status === 'all' ? undefined : [status]
    });
  };

  const getStatusIcon = (status: BridgeStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
      case 'bridging':
      case 'settling':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: BridgeStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
      case 'bridging':
      case 'settling':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast('Copied to clipboard');
  };

  const formatAmount = (amount: string, privacyLevel: string, hideAmount: boolean) => {
    if (hideAmount || privacyLevel === 'maximum') {
      return '***';
    }
    return `${amount} ${privacyLevel === 'high' ? '***' : ''}`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.successRate.toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalVolume}</div>
            <p className="text-xs text-muted-foreground">
              Encrypted amounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.averageTime / 60000)}m
            </div>
            <p className="text-xs text-muted-foreground">
              Bridge completion time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Privacy Usage</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(stats.privacyUsage).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Privacy levels used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Bridge History</CardTitle>
          <CardDescription>
            View and manage your cross-chain bridge transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions, tokens, or chains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="shrink-0">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('all')}
            >
              All ({stats.totalTransactions})
            </Button>
            <Button
              variant={selectedStatus === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('completed')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Completed ({stats.successfulTransactions})
            </Button>
            <Button
              variant={selectedStatus === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('pending')}
            >
              <Clock className="h-4 w-4 mr-1" />
              Pending
            </Button>
            <Button
              variant={selectedStatus === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('failed')}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Failed ({stats.failedTransactions})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading bridge history...</p>
          </div>
        ) : records.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bridge transactions found</h3>
              <p className="text-muted-foreground">
                Your bridge history will appear here once you start making transactions.
              </p>
            </CardContent>
          </Card>
        ) : (
          records.map((record) => (
            <Card key={record.transaction.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <img 
                          src={record.transaction.sourceChain.icon} 
                          alt={record.transaction.sourceChain.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium">{record.transaction.sourceChain.name}</span>
                      </div>
                      <div className="text-muted-foreground">→</div>
                      <div className="flex items-center gap-2">
                        <img 
                          src={record.transaction.targetChain.icon} 
                          alt={record.transaction.targetChain.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium">{record.transaction.targetChain.name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          {formatAmount(
                            record.transaction.amount,
                            record.transaction.privacyLevel,
                            record.privacySettings.hideAmount
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {record.transaction.token.symbol}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.transaction.status)}
                          <Badge className={getStatusColor(record.transaction.status)}>
                            {record.transaction.status}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">
                          {formatDistanceToNow(record.transaction.timestamp, { addSuffix: true })}
                        </p>
                        {record.transaction.actualTime && (
                          <p className="text-sm text-muted-foreground">
                            Completed in {Math.round(record.transaction.actualTime / 60000)}m
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        <span>Privacy: {record.transaction.privacyLevel}</span>
                      </div>
                      {record.transaction.fees && (
                        <div>
                          Fees: {record.transaction.fees} ETH
                        </div>
                      )}
                      {record.userNotes && (
                        <div className="flex items-center gap-1">
                          <span>Note: {record.userNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(record.transaction.hash)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(
                        `${record.transaction.sourceChain.explorerUrl}/tx/${record.transaction.hash}`,
                        '_blank'
                      )}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
