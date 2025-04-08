
import { useState } from "react";
import { Loader2, Rocket } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";
import { mockAgents } from "@/lib/mockAgents";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Form schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }).max(50),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(300),
  category: z.string().min(1, { message: "Please select a category" }),
  githubUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  price: z.number().min(10, { message: "Minimum price is 10 $TASK" }).max(10000, { message: "Maximum price is 10,000 $TASK" }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = ["Data Analysis", "Code Assistant", "Chatbot", "Image Generation", "Text Processing"];

const CreateAgentDialog: React.FC<CreateAgentDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useWeb3();
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      githubUrl: "",
      price: 100,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new agent with mock data
      const newAgent = {
        id: `agent-${Date.now()}`,
        name: data.name,
        description: data.description,
        category: data.category,
        githubUrl: data.githubUrl,
        price: data.price,
        rating: 0,
        ratingCount: 0,
        creatorId: user?.id || "unknown",
        creatorName: user?.username || "Anonymous",
        creatorAvatarUrl: user?.avatarUrl || "",
        imageUrl: `https://api.dicebear.com/6.x/bottts/svg?seed=${Date.now()}`,
        purchasedBy: [],
        dateCreated: new Date().toISOString(),
      };
      
      // Add to mock data
      mockAgents.unshift(newAgent);
      
      toast.success("Agent listed successfully!", {
        description: "Your AI agent is now available on the marketplace.",
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Failed to list agent", {
        description: "There was an error while creating your agent. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-brand-purple" />
            List Your AI Agent
          </DialogTitle>
          <DialogDescription>
            Share your custom AI agent with the community and earn $TASK tokens.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Code Review Assistant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what your agent does..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/yourusername/repository" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Price ($TASK tokens)</span>
                    <span className="font-mono text-sm text-gray-400">{field.value} $TASK</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={10}
                      max={1000}
                      step={10}
                      defaultValue={[100]}
                      onValueChange={(value) => field.onChange(value[0])}
                      value={[field.value]}
                      className="py-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
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
                type="submit" 
                className="purple-gradient"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                List Agent
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAgentDialog;
