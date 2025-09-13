import { useEffect, useState } from "react";

interface DataParticle {
  id: number;
  delay: number;
}

export const BridgeAnimation = () => {
  const [particles, setParticles] = useState<DataParticle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: i * 0.6,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      {/* Hero gradient background */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      
      {/* Source Chain */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-4xl px-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-bridge animate-bridge-pulse flex items-center justify-center shadow-bridge">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-primary"></div>
            </div>
          </div>
          <span className="mt-3 text-sm font-medium text-foreground/80">Source Chain</span>
        </div>

        {/* Bridge Connection */}
        <div className="flex-1 relative h-1 mx-8">
          {/* Main bridge line */}
          <div className="absolute inset-0 bg-gradient-data rounded-full opacity-60"></div>
          
          {/* Data particles */}
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute top-1/2 left-0 w-2 h-2 bg-bridge-data-stream rounded-full animate-data-flow"
                style={{
                  animationDelay: `${particle.delay}s`,
                  transform: "translateY(-50%)",
                }}
              ></div>
            ))}
          </div>
          
          {/* Bridge endpoints */}
          <div className="absolute -left-1 top-1/2 w-2 h-2 bg-primary rounded-full transform -translate-y-1/2"></div>
          <div className="absolute -right-1 top-1/2 w-2 h-2 bg-bridge-secondary rounded-full transform -translate-y-1/2"></div>
        </div>

        {/* Destination Chain */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-bridge-secondary to-primary animate-bridge-pulse flex items-center justify-center shadow-bridge">
            <div className="w-12 h-12 rounded-full bg-bridge-secondary/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-bridge-secondary"></div>
            </div>
          </div>
          <span className="mt-3 text-sm font-medium text-foreground/80">Destination Chain</span>
        </div>
      </div>

      {/* Rotating border effect */}
      <div className="absolute inset-0 rounded-2xl border border-primary/20 animate-glow-rotate"></div>
    </div>
  );
};