import { BridgeAnimation } from "@/components/BridgeAnimation";
import { BridgeInterface } from "@/components/BridgeInterface";
import { BridgeHistory } from "@/components/BridgeHistory";
import { BridgeNotifications } from "@/components/BridgeNotifications";
import { WalletConnect } from "@/components/WalletConnect";
import { Shield, Zap, Lock, History, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img 
                src="/logo-icon.svg" 
                alt="Stealth Swap Logo" 
                className="w-full h-full"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-bridge bg-clip-text text-transparent">
              Stealth Swap
            </span>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-bridge bg-clip-text text-transparent">
              Move Assets Privately
            </span>
            <br />
            <span className="text-foreground">Across Chains</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in-up">
            Cross-chain swaps where transaction amounts and sender/receiver remain 
            hidden until settlement is confirmed. Experience true privacy in DeFi.
          </p>

          {/* Bridge Animation */}
          <div className="mb-16 animate-fade-in-up">
            <BridgeAnimation />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bridge-card animate-fade-in-up">
              <div className="w-12 h-12 bg-gradient-bridge rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Zero-Knowledge Privacy</h3>
              <p className="text-muted-foreground">
                Transaction amounts and addresses remain encrypted using advanced ZK proofs
              </p>
            </div>
            
            <div className="text-center p-6 bridge-card animate-fade-in-up">
              <div className="w-12 h-12 bg-gradient-bridge rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Cross-chain swaps complete in minutes, not hours, with optimal routing
              </p>
            </div>
            
            <div className="text-center p-6 bridge-card animate-fade-in-up">
              <div className="w-12 h-12 bg-gradient-bridge rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Settlements</h3>
              <p className="text-muted-foreground">
                Multi-signature security with automated settlement verification
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Bridge Interface */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start Your Private Bridge</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience secure cross-chain transfers with complete privacy protection using Fully Homomorphic Encryption.
            </p>
          </div>
          
          <Tabs defaultValue="bridge" className="w-full max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="bridge" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Bridge Assets
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Transaction History
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bridge" className="space-y-8">
              <div className="flex justify-center">
                <BridgeInterface />
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-8">
              <BridgeHistory />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-8">
              <BridgeNotifications />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded overflow-hidden">
              <img 
                src="/logo-icon.svg" 
                alt="Stealth Swap Logo" 
                className="w-full h-full"
              />
            </div>
            <span className="font-semibold">Stealth Swap Protocol</span>
          </div>
          <p className="text-sm">
            Empowering financial privacy across all blockchain networks with FHE encryption
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;