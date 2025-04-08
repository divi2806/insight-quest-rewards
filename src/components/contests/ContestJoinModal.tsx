
import { useState } from "react";
import { Coins, AlertCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "sonner";

interface ContestJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  contest: {
    id: string;
    title: string;
    entryFee: number;
    prizePool: number;
  } | null;
  onJoin: (contestId: string) => Promise<void>;
}

const ContestJoinModal: React.FC<ContestJoinModalProps> = ({ 
  isOpen, 
  onClose, 
  contest,
  onJoin 
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const { user } = useWeb3();
  
  if (!contest) return null;
  
  const userTokenBalance = user?.tokensEarned || 0;
  const hasEnoughTokens = userTokenBalance >= contest.entryFee;

  const handleJoinContest = async () => {
    if (!contest) return;
    
    try {
      setIsJoining(true);
      await onJoin(contest.id);
      toast.success("You've successfully joined the contest!");
      onClose();
    } catch (error) {
      toast.error("Failed to join the contest. Please try again.");
      console.error(error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Contest</DialogTitle>
          <DialogDescription>
            You're about to enter "{contest.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between py-2 border-b border-brand-purple/10">
            <span className="text-sm">Entry Fee:</span>
            <span className="flex items-center font-medium">
              <Coins className="h-4 w-4 mr-1 text-brand-purple" /> 
              {contest.entryFee} $TASK
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-brand-purple/10">
            <span className="text-sm">Prize Pool:</span>
            <span className="flex items-center font-medium">
              <Coins className="h-4 w-4 mr-1 text-yellow-500" /> 
              {contest.prizePool} $TASK
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Your Balance:</span>
            <span className="flex items-center font-medium">
              <Coins className="h-4 w-4 mr-1 text-brand-purple" /> 
              {userTokenBalance} $TASK
            </span>
          </div>

          {!hasEnoughTokens && (
            <div className="mt-4 p-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-500">Insufficient balance</p>
                <p className="text-xs text-red-400/70 mt-1">
                  You need {contest.entryFee - userTokenBalance} more $TASK tokens to join this contest. 
                  Complete tasks to earn more tokens.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="purple-gradient" 
            disabled={isJoining || !hasEnoughTokens}
            onClick={handleJoinContest}
          >
            {isJoining ? "Joining..." : "Confirm & Join"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContestJoinModal;
