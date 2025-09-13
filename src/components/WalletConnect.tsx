import { Wallet, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { toast } from "sonner";

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
    toast("Wallet disconnected");
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-xl border border-green-500/30">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">Protected</span>
        </div>
        
        <div className="flex items-center gap-3 bridge-card px-4 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-mono">{address.substring(0, 6)}...{address.substring(-4)}</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="text-destructive hover:bg-destructive/10"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      onClick={openConnectModal}
                      className="bridge-button flex items-center gap-2"
                    >
                      <Wallet className="h-4 w-4" />
                      Connect Wallet
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button
                      onClick={openChainModal}
                      className="bridge-button flex items-center gap-2"
                    >
                      Wrong network
                    </Button>
                  );
                }

                return (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-xl border border-green-500/30">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Protected</span>
                    </div>
                    
                    <div className="flex items-center gap-3 bridge-card px-4 py-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-mono">{account.displayName}</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openAccountModal}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      Disconnect
                    </Button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Zap className="h-4 w-4 text-bridge-glow" />
        <span>Encrypted & Private</span>
      </div>
    </div>
  );
};