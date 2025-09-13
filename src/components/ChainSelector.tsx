import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Chain {
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

const SUPPORTED_CHAINS: Chain[] = [
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "🔷" },
  { id: "polygon", name: "Polygon", symbol: "MATIC", icon: "🟣" },
  { id: "bsc", name: "BSC", symbol: "BNB", icon: "🟡" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB", icon: "🔵" },
  { id: "optimism", name: "Optimism", symbol: "OP", icon: "🔴" },
];

interface ChainSelectorProps {
  label: string;
  selectedChain: Chain | null;
  onChainSelect: (chain: Chain) => void;
  disabled?: boolean;
}

export const ChainSelector = ({ label, selectedChain, onChainSelect, disabled }: ChainSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="chain-selector w-full justify-between h-16"
            disabled={disabled}
          >
            {selectedChain ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedChain.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{selectedChain.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedChain.symbol}</div>
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground">Select Chain</span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {SUPPORTED_CHAINS.map((chain) => (
            <DropdownMenuItem
              key={chain.id}
              onClick={() => onChainSelect(chain)}
              className="flex items-center gap-3 py-3 cursor-pointer"
            >
              <span className="text-xl">{chain.icon}</span>
              <div>
                <div className="font-medium">{chain.name}</div>
                <div className="text-sm text-muted-foreground">{chain.symbol}</div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};