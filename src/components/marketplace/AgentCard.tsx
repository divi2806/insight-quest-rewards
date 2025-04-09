
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Tag, Info } from "lucide-react";
import { Agent } from "@/types";
import { useWeb3 } from "@/contexts/Web3Context";
import PurchaseAgentDialog from "./PurchaseAgentDialog";
import AgentDetailsDialog from "./AgentDetailsDialog";

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { user } = useWeb3();
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  const isPurchased = user?.address && agent.purchasedBy?.includes(user.address);
  
  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="h-12 w-12 rounded-lg overflow-hidden bg-brand-purple/10 mb-2">
              <img src={agent.imageUrl} alt={agent.name} className="w-full h-full object-cover" />
            </div>
            <Badge>{agent.category}</Badge>
          </div>
          <CardTitle className="text-xl">{agent.name}</CardTitle>
          <CardDescription className="flex items-center mt-1">
            <Avatar className="h-5 w-5 mr-1">
              <AvatarImage src={agent.creatorAvatarUrl} alt={agent.creatorName} />
              <AvatarFallback>{agent.creatorName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span>{agent.creatorName}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-gray-400 line-clamp-3">{agent.description}</p>
          <div className="flex items-center mt-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(agent.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : index < agent.rating
                      ? "text-yellow-400 fill-yellow-400 opacity-60"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm ml-2">({agent.ratingCount})</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-3 border-t border-border">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center text-xl font-bold">
              <span className="text-brand-purple">{agent.price}</span>
              <span className="text-sm ml-1 text-gray-500 font-normal">$TASK</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full w-8 h-8 p-0" 
              onClick={() => setDetailsModalOpen(true)}
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">Details</span>
            </Button>
          </div>
          {isPurchased ? (
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Download
            </Button>
          ) : (
            <Button 
              onClick={() => setPurchaseModalOpen(true)}
              className="w-full purple-gradient"
            >
              <Tag className="mr-2 h-4 w-4" />
              Purchase
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <PurchaseAgentDialog 
        agent={agent} 
        open={purchaseModalOpen} 
        onOpenChange={setPurchaseModalOpen}
      />
      
      <AgentDetailsDialog
        agent={agent}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </>
  );
};

export default AgentCard;
