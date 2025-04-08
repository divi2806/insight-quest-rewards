
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ContestCard, { ContestCategory } from "@/components/contests/ContestCard";
import ContestFilters from "@/components/contests/ContestFilters";
import ContestJoinModal from "@/components/contests/ContestJoinModal";
import { mockContests } from "@/lib/mockContests";
import { toast } from "sonner";
import { Trophy } from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";

const ContestsPage = () => {
  const { user } = useWeb3();
  const [contests, setContests] = useState(mockContests);
  const [selectedContest, setSelectedContest] = useState<typeof mockContests[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFilterChange = (filters: {
    category: string;
    sortBy: string;
    minPrize: number | null;
    maxEntryFee: number | null;
    searchQuery: string;
  }) => {
    let filtered = [...mockContests];

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(contest => contest.category === filters.category);
    }

    // Apply min prize filter
    if (filters.minPrize !== null) {
      filtered = filtered.filter(contest => contest.prizePool >= filters.minPrize!);
    }

    // Apply max entry fee filter
    if (filters.maxEntryFee !== null) {
      filtered = filtered.filter(contest => contest.entryFee <= filters.maxEntryFee!);
    }

    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        contest =>
          contest.title.toLowerCase().includes(query) ||
          contest.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "endingSoon":
        filtered.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
        break;
      case "mostParticipants":
        filtered.sort((a, b) => b.participants - a.participants);
        break;
      case "highestPrize":
        filtered.sort((a, b) => b.prizePool - a.prizePool);
        break;
      case "lowestEntry":
        filtered.sort((a, b) => a.entryFee - b.entryFee);
        break;
      default:
        break;
    }

    setContests(filtered);
  };

  const handleEnterContest = (contestId: string) => {
    if (!user) {
      toast.error("Please connect your wallet to enter contests");
      return;
    }

    const contest = mockContests.find(c => c.id === contestId);
    if (contest) {
      setSelectedContest(contest);
      setModalOpen(true);
    }
  };

  const handleJoinContest = async (contestId: string) => {
    // In a real app, this would make an API call to join the contest
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve();
        } else {
          reject(new Error("Failed to join contest"));
        }
      }, 1000);
    });
  };

  // Get featured contests
  const featuredContests = contests.filter(contest => contest.featured);
  const regularContests = contests.filter(contest => !contest.featured);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-brand-purple to-brand-purple-dark p-3 rounded-full">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-purple to-brand-purple-dark text-transparent bg-clip-text">
            Contests & Challenges
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Compete in interactive challenges, showcase your skills, and win $TASK tokens.
            Enter contests by staking tokens and earn from the prize pool!
          </p>
        </div>

        {/* Filters */}
        <ContestFilters onFilterChange={handleFilterChange} />

        {/* Featured contests */}
        {featuredContests.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="text-yellow-400 mr-2">★</span> Featured Contests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  {...contest}
                  onEnterContest={handleEnterContest}
                />
              ))}
            </div>
          </div>
        )}

        {/* All contests */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">All Contests</h2>
          {regularContests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  {...contest}
                  onEnterContest={handleEnterContest}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-gray-500">
              <p>No contests found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Join Contest Modal */}
      <ContestJoinModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        contest={selectedContest}
        onJoin={handleJoinContest}
      />
    </MainLayout>
  );
};

export default ContestsPage;
