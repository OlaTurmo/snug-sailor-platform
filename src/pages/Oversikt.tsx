
import { useEffect, useState } from "react";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Upload, Send, Divide } from "lucide-react";
import { EstatesSection } from "@/components/overview/EstatesSection";
import { ProgressSection } from "@/components/overview/ProgressSection";
import { TasksSection } from "@/components/overview/TasksSection";
import { NotificationsSection } from "@/components/overview/NotificationsSection";
import { AddEstateDialog } from "@/components/estates/AddEstateDialog";

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

interface Estate {
  id: string;
  name: string;
  deceased_name: string;
  deceased_date: string;
  deceased_id_number: string;
  created_at: string;
}

const Oversikt = () => {
  const { user } = useAuth();
  useProtectedRoute();
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [estates, setEstates] = useState<Estate[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) {
      console.log('No user found, skipping data fetch');
      setError('Ingen bruker funnet. Vennligst logg inn.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Starting data fetch for user:', user.id);
      
      // Fetch estates first
      console.log('Fetching estates...');
      const { data: estatesData, error: estatesError } = await supabase
        .from('estates')
        .select('*')
        .order('created_at', { ascending: false });

      if (estatesError) {
        console.error('Error fetching estates:', estatesError);
        throw new Error(`Failed to fetch estates: ${estatesError.message}`);
      }
      
      setEstates(estatesData || []);
      
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (tasksError) {
        throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
      }

      setTasks(tasksData || []);
      
      // Fetch notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (notificationsError) {
        throw new Error(`Failed to fetch notifications: ${notificationsError.message}`);
      }

      setNotifications(notificationsData || []);
      
      // Calculate progress
      if (tasksData) {
        const completedTasks = tasksData.filter(task => task.status === 'completed').length;
        const totalTasks = tasksData.length;
        setProgress(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchData:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Det oppstod en feil ved lasting av data: ${errorMessage}`);
      toast({
        title: "Feil ved lasting av data",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setError('Vennligst logg inn for å se denne siden');
      setIsLoading(false);
    }
  }, [user]);

  const handleUploadDocument = () => {
    toast({
      title: "Last opp dokument",
      description: "Denne funksjonen kommer snart.",
    });
  };

  const handleAssignTask = () => {
    toast({
      title: "Tildel oppgave",
      description: "Denne funksjonen kommer snart.",
    });
  };

  const handleStartDivision = () => {
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Oversikt</h1>
            <div className="flex gap-2">
              <AddEstateDialog onEstateCreated={fetchData} />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Laster inn data...</p>
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-red-600">{error}</p>
                <Button 
                  onClick={fetchData} 
                  variant="outline" 
                  className="mx-auto mt-4 block"
                >
                  Prøv igjen
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <EstatesSection estates={estates} onEstateCreated={fetchData} />
              <ProgressSection 
                progress={progress} 
                completedTasks={tasks.filter(t => t.status === 'completed').length}
                totalTasks={tasks.length}
              />

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
                <TasksSection tasks={tasks} />
                <NotificationsSection notifications={notifications} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Oversikt;
