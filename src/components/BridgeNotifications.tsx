import { useState, useEffect } from 'react';
import { BridgeNotification } from '@/types/bridge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  ExternalLink,
  X,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface BridgeNotificationsProps {
  className?: string;
}

// Mock notifications data
const mockNotifications: BridgeNotification[] = [
  {
    id: 'notif-001',
    type: 'success',
    title: 'Bridge Completed Successfully',
    message: 'Your USDC bridge from Ethereum to Polygon has been completed.',
    transactionId: 'bridge-001',
    timestamp: Date.now() - 300000, // 5 minutes ago
    read: false,
    actionUrl: '/bridge/history'
  },
  {
    id: 'notif-002',
    type: 'info',
    title: 'Bridge Processing',
    message: 'Your ETH bridge is currently being processed. Estimated completion in 15 minutes.',
    transactionId: 'bridge-002',
    timestamp: Date.now() - 900000, // 15 minutes ago
    read: false
  },
  {
    id: 'notif-003',
    type: 'warning',
    title: 'High Gas Fees Detected',
    message: 'Current gas fees are 3x higher than usual. Consider waiting or using a different time.',
    timestamp: Date.now() - 1800000, // 30 minutes ago
    read: true
  },
  {
    id: 'notif-004',
    type: 'error',
    title: 'Bridge Failed',
    message: 'Your bridge transaction failed due to insufficient gas. Please retry with higher gas limit.',
    transactionId: 'bridge-003',
    timestamp: Date.now() - 3600000, // 1 hour ago
    read: true,
    actionUrl: '/bridge/retry'
  }
];

export const BridgeNotifications = ({ className }: BridgeNotificationsProps) => {
  const [notifications, setNotifications] = useState<BridgeNotification[]>(mockNotifications);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: BridgeNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: BridgeNotification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      case 'error':
        return 'border-red-500/20 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'info':
        return 'border-blue-500/20 bg-blue-500/5';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast('Notification deleted');
  };

  const handleNotificationClick = (notification: BridgeNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      // Navigate to action URL
      window.location.href = notification.actionUrl;
    }
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Bridge Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {displayedNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! New bridge notifications will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          displayedNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read ? 'ring-2 ring-primary/20' : ''
              } ${getNotificationColor(notification.type)}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </span>
                          {notification.transactionId && (
                            <span>Transaction: {notification.transactionId}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {notification.actionUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = notification.actionUrl!;
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Show More/Less Button */}
      {notifications.length > 5 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All (${notifications.length})`}
          </Button>
        </div>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Bridge Status Updates</p>
              <p className="text-xs text-muted-foreground">Get notified when bridge status changes</p>
            </div>
            <Button variant="outline" size="sm">Enabled</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Gas Fee Alerts</p>
              <p className="text-xs text-muted-foreground">Alert when gas fees are unusually high</p>
            </div>
            <Button variant="outline" size="sm">Enabled</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Privacy Updates</p>
              <p className="text-xs text-muted-foreground">Notifications about privacy settings</p>
            </div>
            <Button variant="outline" size="sm">Enabled</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
