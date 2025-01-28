import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Users,
  Activity,
  Send,
  UserPlus,
  Shield,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  created_at: string;
}

interface ActivityLog {
  id: string;
  action: string;
  user_id: string;
  user_name: string;
  created_at: string;
  details: string;
}

const CollaborationTools = () => {
  useProtectedRoute();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages
  const { data: messages } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      console.log("Fetching messages...");
      const { data, error } = await supabase
        .from("messages")
        .select("*, profiles(name)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      return data as Message[];
    },
  });

  // Fetch activity logs
  const { data: activityLogs } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      console.log("Fetching activity logs...");
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*, profiles(name)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching activity logs:", error);
        throw error;
      }

      return data as ActivityLog[];
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      console.log("Sending message:", content);
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            content,
            sender_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Message send error:", error);
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Collaboration Tools</h1>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Users className="w-4 h-4 mr-2" />
            User Roles
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="w-4 h-4 mr-2" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Messages</CardTitle>
              <CardDescription>
                Communicate with your team members in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] mb-4">
                <div className="space-y-4">
                  {messages?.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.sender_id === user?.id
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      } max-w-[80%]`}
                    >
                      <p className="font-semibold text-sm">
                        {message.sender_name}
                      </p>
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" disabled={sendMessageMutation.isPending}>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>User Roles & Permissions</CardTitle>
              <CardDescription>
                Manage team member access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Team Members</h3>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Member
                  </Button>
                </div>
                <div className="space-y-2">
                  {/* Role management UI will be implemented here */}
                  <div className="p-4 border rounded-lg">
                    <p className="text-muted-foreground">
                      Role management features coming soon...
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Track all changes and updates in your estate project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {activityLogs?.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start space-x-4 p-3 border-b"
                    >
                      <Activity className="w-4 h-4 mt-1" />
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.details}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          By {log.user_name} on{" "}
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollaborationTools;