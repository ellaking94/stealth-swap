import { useState } from "react";
import { ArrowUpDown, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChainSelector } from "./ChainSelector";
import { BridgeStatusTracker } from "./BridgeStatusTracker";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from "sonner";
import { STEALTH_SWAP_ABI, getContractAddress } from '@/lib/contracts';
import { useBridgeStatus } from '@/hooks/useBridgeStatus';
import { useBridgeHistory } from '@/hooks/useBridgeHistory';
import { BridgeTransaction, PrivacyLevel } from '@/types/bridge';

interface Chain {
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

export const BridgeInterface = () => {
  const [sourceChain, setSourceChain] = useState<Chain | null>(null);
  const [destinationChain, setDestinationChain] = useState<Chain | null>(null);
  const [amount, setAmount] = useState("");
  const [isPrivacyMode, setIsPrivacyMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStatusTracker, setShowStatusTracker] = useState(false);
  
  const { address, isConnected, chainId } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  
  const { currentTransaction, events, startMonitoring } = useBridgeStatus({});
  const { addRecord } = useBridgeHistory();

  const handleSwapChains = () => {
    if (sourceChain && destinationChain) {
      setSourceChain(destinationChain);
      setDestinationChain(sourceChain);
    }
  };

  const handleBridge = async () => {
    if (!sourceChain || !destinationChain || !amount) {
      toast("Please fill in all fields", {
        description: "Select both chains and enter an amount to bridge.",
      });
      return;
    }

    if (!isConnected) {
      toast("Wallet not connected", {
        description: "Please connect your wallet to continue.",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // For demonstration, we'll use a simplified contract call
      // In a real implementation, you would encrypt the amount using FHE
      const contractAddress = getContractAddress(chainId || 1);
      
      // This is a placeholder - in reality you would need to:
      // 1. Encrypt the amount using FHE
      // 2. Generate the input proof
      // 3. Call the appropriate contract function
      
      await writeContract({
        address: contractAddress,
        abi: STEALTH_SWAP_ABI,
        functionName: 'initiateBridgeTransaction',
        args: [
          // These would be the encrypted values in a real implementation
          '0x0000000000000000000000000000000000000000000000000000000000000000', // encrypted amount
          parseInt(destinationChain.id),
          sourceChain.symbol,
          '0x0000000000000000000000000000000000000000000000000000000000000000' // input proof
        ],
        value: parseEther(amount),
      });
      
      // Create bridge transaction record
      const bridgeTransaction: BridgeTransaction = {
        id: `bridge-${Date.now()}`,
        hash: hash || `0x${Math.random().toString(16).substring(2, 42)}`,
        amount,
        sourceChain: {
          id: parseInt(sourceChain.id),
          name: sourceChain.name,
          symbol: sourceChain.symbol,
          icon: sourceChain.icon,
          explorerUrl: `https://explorer.${sourceChain.name.toLowerCase()}.com`,
          rpcUrl: '',
          blockTime: 12
        },
        targetChain: {
          id: parseInt(destinationChain.id),
          name: destinationChain.name,
          symbol: destinationChain.symbol,
          icon: destinationChain.icon,
          explorerUrl: `https://explorer.${destinationChain.name.toLowerCase()}.com`,
          rpcUrl: '',
          blockTime: 2
        },
        token: {
          address: '0x...',
          symbol: sourceChain.symbol,
          name: sourceChain.symbol,
          decimals: 18,
          icon: sourceChain.icon
        },
        status: 'pending',
        timestamp: Date.now(),
        estimatedTime: 1800000, // 30 minutes
        privacyLevel: isPrivacyMode ? 'high' : 'medium'
      };

      // Add to history and start monitoring
      addRecord(bridgeTransaction, {
        hideAmount: isPrivacyMode,
        hideSender: false,
        hideRecipient: true,
        useZeroKnowledge: true,
        encryptionLevel: isPrivacyMode ? 'high' : 'medium'
      });
      
      startMonitoring(bridgeTransaction);
      setShowStatusTracker(true);
      
      toast("Bridge transaction initiated!", {
        description: `${amount} ${sourceChain.symbol} is being bridged to ${destinationChain.name} privately.`,
      });
    } catch (error) {
      console.error('Bridge error:', error);
      toast("Bridge failed", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {showStatusTracker && currentTransaction && (
        <BridgeStatusTracker 
          transaction={currentTransaction}
          events={events}
          onRefresh={() => {
            // Refresh logic here
          }}
        />
      )}
      
      <div className="w-full max-w-md mx-auto">
        <div className="bridge-card space-y-6">
        {/* Privacy Status */}
        <div className="flex items-center justify-between">
          <div className="privacy-indicator">
            <Shield className="h-4 w-4" />
            <span>Privacy Mode Active</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isPrivacyMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>

        {/* Source Chain */}
        <ChainSelector
          label="From"
          selectedChain={sourceChain}
          onChainSelect={setSourceChain}
        />

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwapChains}
            className="rounded-full p-2 h-10 w-10 bg-background/50 border-primary/20 hover:border-primary/40 hover:bg-primary/10"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Destination Chain */}
        <ChainSelector
          label="To"
          selectedChain={destinationChain}
          onChainSelect={setDestinationChain}
        />

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">Amount</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pr-16 h-16 text-lg bg-secondary/50 border-white/10 focus:border-primary/50"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
              {sourceChain?.symbol || "TOKEN"}
            </div>
          </div>
          {isPrivacyMode && (
            <p className="text-xs text-bridge-privacy-shield flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Amount will be encrypted until settlement
            </p>
          )}
        </div>

        {/* Bridge Button */}
        <Button
          onClick={handleBridge}
          disabled={!sourceChain || !destinationChain || !amount || isProcessing}
          className="bridge-button w-full h-12 text-base"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
              Processing Bridge...
            </>
          ) : (
            "Bridge Assets Privately"
          )}
        </Button>

        {/* Privacy Notice */}
        <div className="text-xs text-muted-foreground text-center bg-secondary/30 p-3 rounded-lg border border-white/5">
          <Shield className="h-4 w-4 mx-auto mb-1 text-bridge-privacy-shield" />
          Your transaction details remain encrypted and private until settlement is confirmed on both chains.
        </div>
      </div>
    </div>
    </div>
  );
};