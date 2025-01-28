import { useEffect, useState } from "react";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Check, X, ArrowRight, List, Calendar, User, Upload, Send, Divide, Bell } from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: string;
  deadline: string;
  assigned_to: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

const Oversikt = () => {
  const { user } = useAuth();
  useProtectedRoute();
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching tasks and notifications');
        
        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            status,
            deadline,
            assigned_to
          `)
          .order('created_at', { ascending: false });

        if (tasksError) throw tasksError;
        
        // Fetch notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (notificationsError) throw notificationsError;

        setTasks(tasksData || []);
        setNotifications(notificationsData || []);
        
        // Calculate progress based on completed tasks
        if (tasksData) {
          const completedTasks = tasksData.filter(task => task.status === 'completed').length;
          const totalTasks = tasksData.length;
          setProgress(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Feil ved lasting av data",
          description: "Kunne ikke laste inn oppgaver og varsler.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, toast]);

  const handleUploadDocument = () => {
    // TODO: Implement document upload
    toast({
      title: "Last opp dokument",
      description: "Denne funksjonen kommer snart.",
    });
  };

  const handleAssignTask = () => {
    // TODO: Implement task assignment
    toast({
      title: "Tildel oppgave",
      description: "Denne funksjonen kommer snart.",
    });
  };

  const handleStartDivision = () => {
    // TODO: Implement inheritance division
    toast({
      title: "Start arveoppgjør",
      description: "Denne funksjonen kommer snart.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Progress Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Fremdrift
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2" />
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>{Math.round(progress)}% fullført</span>
                <span>{tasks.filter(t => t.status === 'completed').length} av {tasks.length} oppgaver fullført</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={handleUploadDocument}
              className="flex items-center gap-2 h-auto py-4"
              variant="outline"
            >
              <Upload className="h-5 w-5" />
              Last opp dokument
            </Button>
            <Button
              onClick={handleAssignTask}
              className="flex items-center gap-2 h-auto py-4"
              variant="outline"
            >
              <Send className="h-5 w-5" />
              Tildel oppgave
            </Button>
            <Button
              onClick={handleStartDivision}
              className="flex items-center gap-2 h-auto py-4"
              variant="outline"
            >
              <Divide className="h-5 w-5" />
              Start arvefordeling
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  Oppgaver
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Oppgave</TableHead>
                        <TableHead>Frist</TableHead>
                        <TableHead>Tildelt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            {task.status === 'completed' ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell>{task.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(task.deadline).toLocaleDateString('no-NO')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {task.assigned_to}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Varsler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500 mt-2 block">
                        {new Date(notification.created_at).toLocaleString('no-NO')}
                      </span>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Ingen nye varsler
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Oversikt;