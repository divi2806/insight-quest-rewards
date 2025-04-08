
import { useState } from "react";
import { Search, Filter, Plus, Tag } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWeb3 } from "@/contexts/Web3Context";
import AgentCard from "@/components/marketplace/AgentCard";
import CreateAgentDialog from "@/components/marketplace/CreateAgentDialog";
import { mockAgents } from "@/lib/mockAgents";

// Agent category options
const CATEGORIES = ["All", "Data Analysis", "Code Assistant", "Chatbot", "Image Generation", "Text Processing"];

const MarketplacePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { isConnected } = useWeb3();

  // Filter agents based on search term and selected category
  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Agents Marketplace</h1>
            <p className="text-gray-400 max-w-2xl">
              Discover and purchase custom AI agents created by the community. All transactions are made using $TASK tokens.
            </p>
          </div>
          
          {isConnected && (
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="purple-gradient gap-2"
            >
              <Plus className="h-4 w-4" />
              List Your Agent
            </Button>
          )}
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center overflow-x-auto pb-2 sm:pb-0">
            <Filter className="text-gray-400 h-4 w-4 flex-shrink-0" />
            {CATEGORIES.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-brand-purple hover:bg-brand-purple/90" : "border-brand-purple/30"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Agent cards grid */}
        {filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No agents found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              We couldn't find any AI agents matching your search criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>

      {/* Create Agent Dialog */}
      <CreateAgentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </MainLayout>
  );
};

export default MarketplacePage;
