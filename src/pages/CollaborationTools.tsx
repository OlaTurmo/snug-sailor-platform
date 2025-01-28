import { Navbar } from "@/components/Navbar";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, UserPlus } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  created_at: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  resource_type: string;
  resource_id: string;
  created_at: string;
}

const CollaborationTools = () => {
  useProtectedRoute();
  const { user } = useAuth();
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user,
  });

  // Fetch activity logs
  const { data: activityLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["activity_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ActivityLog[];
    },
    enabled: !!user,
  });

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const { error } = await supabase.from("messages").insert([
        {
          content: newMessage,
          sender_id: user.id,
          sender_name: user.email,
        },
      ]);

      if (error) throw error;

      setNewMessage("");
      toast({
        title: "Melding sendt",
        description: "Meldingen din har blitt sendt.",
      });
    } catch (error) {
      toast({
        title: "Feil",
        description: "Kunne ikke sende melding. Vennligst prøv igjen.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Samarbeid</h1>

        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList>
            <TabsTrigger value="messages">Meldinger</TabsTrigger>
            <TabsTrigger value="activity">Aktivitetslogg</TabsTrigger>
            <TabsTrigger value="users">Brukerhåndtering</TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Meldinger</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] mb-4">
                  {messagesLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-4 ${
                            message.sender_id === user?.id
                              ? "flex-row-reverse space-x-reverse"
                              : ""
                          }`}
                        >
                          <Avatar>
                            <AvatarFallback>
                              {message.sender_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`flex flex-col ${
                              message.sender_id === user?.id
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <p className="text-sm text-muted-foreground">
                              {message.sender_name}
                            </p>
                            <div
                              className={`rounded-lg p-3 ${
                                message.sender_id === user?.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {message.content}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(message.created_at).toLocaleString('no-NO')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                <form onSubmit={sendMessage} className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Skriv din melding..."
                    className="flex-1"
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Aktivitetslogg</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {logsLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activityLogs?.map((log) => (
                        <div key={log.id} className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarFallback>
                              {log.user_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{log.user_name}</span>{" "}
                              {log.action}
                            </p>
                            <div className="flex space-x-2 mt-1">
                              <Badge variant="secondary">
                                {log.resource_type}
                              </Badge>
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.created_at).toLocaleString('no-NO')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Brukerhåndtering</span>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Inviter Bruker
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Brukerhåndteringsfunksjonalitet vil bli implementert snart.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CollaborationTools;