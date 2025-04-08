
import { useState } from "react";
import { Star, Coins, Github, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { Agent } from "@/types";
import PurchaseAgentDialog from "./PurchaseAgentDialog";

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { toast } = useToast();
  const { isConnected, user } = useWeb3();
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  
  const hasEnoughTokens = isConnected && user ? user.tokens >= agent.price : false;
  const isOwner = isConnected && user ? agent.creatorId === user.id : false;
  const hasPurchased = isConnected && user ? agent.purchasedBy?.includes(user.id) : false;

  const handlePurchase = () => {
    if (!isConnected) {
      toast({
        title: "Please connect your wallet",
        description: "You need to connect your wallet to purchase agents",
        variant: "destructive",
      });
      return;
    }
    
    if (!hasEnoughTokens) {
      toast({
        title: "Insufficient funds",
        description: `You need at least ${agent.price} $TASK tokens to purchase this agent`,
        variant: "destructive",
      });
      return;
    }
    
    setPurchaseDialogOpen(true);
  };

  return (
    <Card className="border-brand-purple/20 hover:border-brand-purple/40 transition-all overflow-hidden">
      <div className="p-4 relative">
        {/* Agent image/avatar */}
        <div className="w-full h-32 rounded-md bg-gradient-to-br from-brand-purple/20 to-brand-dark-lighter flex items-center justify-center mb-4">
          <Avatar className="h-16 w-16 border-2 border-brand-purple/30">
            <AvatarImage src={agent.imageUrl} />
            <AvatarFallback className="bg-brand-dark-lighter text-brand-purple text-xl font-bold">
              {agent.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Category badge */}
        <Badge className="absolute top-6 right-6 bg-brand-dark-lighter border border-brand-purple/30">
          {agent.category}
        </Badge>

        {/* Agent name and rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{agent.name}</h3>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="fill-yellow-400 h-4 w-4" />
            <span className="text-sm">{agent.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Creator info */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-5 w-5 border border-brand-purple/20">
            <AvatarImage src={agent.creatorAvatarUrl} />
            <AvatarFallback className="bg-brand-dark-lighter text-xs">
              {agent.creatorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-400">by {agent.creatorName}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-3 mt-4 h-12">
          {agent.description}
        </p>
      </div>

      <CardFooter className="flex items-center justify-between border-t border-brand-purple/20 p-4 bg-brand-dark-darker/40">
        <div className="flex items-center">
          <Coins className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="font-semibold">{agent.price}</span>
          <span className="text-gray-400 text-sm ml-1">$TASK</span>
        </div>

        <div className="flex items-center gap-2">
          {agent.githubUrl && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => window.open(agent.githubUrl, '_blank')}
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">Github</span>
            </Button>
          )}

          {hasPurchased ? (
            <Button 
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-500 hover:bg-green-500/10"
              onClick={() => window.open(agent.downloadUrl || '#', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Access
            </Button>
          ) : isOwner ? (
            <Button 
              variant="outline" 
              size="sm"
              className="border-brand-purple/30 text-brand-purple"
              disabled
            >
              Your Agent
            </Button>
          ) : (
            <Button 
              size="sm"
              className={hasEnoughTokens ? "bg-brand-purple hover:bg-brand-purple/90" : "bg-gray-500 hover:bg-gray-500/90"}
              disabled={!hasEnoughTokens}
              onClick={handlePurchase}
            >
              Purchase
            </Button>
          )}
        </div>
      </CardFooter>
      
      <PurchaseAgentDialog
        open={purchaseDialogOpen}
        onOpenChange={setPurchaseDialogOpen}
        agent={agent}
      />
    </Card>
  );
};

export default AgentCard;
