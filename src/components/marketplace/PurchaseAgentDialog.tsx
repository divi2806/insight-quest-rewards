
import { useState } from "react";
import { Loader2, Coins, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { Agent } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PurchaseAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent;
}

const PurchaseAgentDialog: React.FC<PurchaseAgentDialogProps> = ({
  open,
  onOpenChange,
  agent,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const { user } = useWeb3();
  
  const handlePurchase = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user's token balance (in a real app, this would be done on the backend)
      if (user && user.tokens >= agent.price) {
        // Update user tokens in localStorage
        const updatedUser = {
          ...user,
          tokens: user.tokens - agent.price
        };
        
        localStorage.setItem(`user_${user.address}`, JSON.stringify(updatedUser));
        
        // Add user to agent's purchasedBy list
        agent.purchasedBy = [...(agent.purchasedBy || []), user.id];
        
        toast.success("Purchase successful!", {
          description: `You've successfully purchased ${agent.name}.`,
        });
        
        setIsPurchased(true);
      }
    } catch (error) {
      console.error("Error purchasing agent:", error);
      toast.error("Purchase failed", {
        description: "There was an error while processing your purchase. Please try again.",
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!isSubmitting) {
        onOpenChange(open);
        if (!open) {
          setIsPurchased(false);
        }
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        {isPurchased ? (
          <>
            <div className="pt-10 pb-6 flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <DialogTitle className="text-xl mb-2">Purchase Successful!</DialogTitle>
              <DialogDescription className="text-center">
                You now have access to {agent.name}. You can access it from your dashboard or directly from the marketplace.
              </DialogDescription>
            </div>
            <DialogFooter>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple/90"
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                You're about to purchase this AI agent using your $TASK tokens.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex items-center gap-4 py-4">
              <Avatar className="h-16 w-16 border border-brand-purple/30">
                <AvatarImage src={agent.imageUrl} />
                <AvatarFallback className="bg-brand-dark-lighter text-brand-purple text-xl font-bold">
                  {agent.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold mb-1">{agent.name}</h3>
                <p className="text-sm text-gray-400">by {agent.creatorName}</p>
                <div className="mt-2 flex items-center">
                  <Coins className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-semibold">{agent.price}</span>
                  <span className="text-gray-400 text-sm ml-1">$TASK</span>
                </div>
              </div>
            </div>
            
            <div className="my-2 p-3 rounded-md bg-brand-dark-lighter/50 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-400">Your balance:</span>
                <span className="font-mono">{user?.tokens || 0} $TASK</span>
              </p>
              <p className="flex justify-between mt-1">
                <span className="text-gray-400">Cost:</span>
                <span className="font-mono">-{agent.price} $TASK</span>
              </p>
              <div className="my-2 border-t border-dashed border-gray-600"></div>
              <p className="flex justify-between font-medium">
                <span>Remaining balance:</span>
                <span className="font-mono">{(user?.tokens || 0) - agent.price} $TASK</span>
              </p>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-brand-purple/30"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                className="purple-gradient"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Purchase
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseAgentDialog;
