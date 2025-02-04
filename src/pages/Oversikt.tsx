import { useEffect, useState } from "react";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Check, X, ArrowRight, List, Calendar, User, Upload, Send, Divide, Bell } from "lucide-react";
import { AddEstateDialog } from "@/components/estates/AddEstateDialog";
import { InviteUserDialog } from "@/components/estates/InviteUserDialog";

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
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching data for user:', user.id);
      
      // Fetch estates
      const { data: estatesData, error: estatesError } = await supabase
        .from('estates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (estatesError) {
        console.error('Error fetching estates:', estatesError);
        throw estatesError;
      }
      
      console.log('Fetched estates:', estatesData);
      
      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;
      
      // Fetch notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (notificationsError) throw notificationsError;

      setEstates(estatesData || []);
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
      setError('Det oppstod en feil ved lasting av data. Vennligst prøv igjen senere.');
      toast({
        title: "Feil ved lasting av data",
        description: "Kunne ikke laste inn data. Vennligst prøv igjen senere.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching data');
      fetchData();
    }
  }, [user]);

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
              {/* Estates Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Aktive bo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Navn på bo</TableHead>
                          <TableHead>Avdød</TableHead>
                          <TableHead>Dødsdato</TableHead>
                          <TableHead>Fødselsnummer</TableHead>
                          <TableHead>Handlinger</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {estates.map((estate) => (
                          <TableRow key={estate.id}>
                            <TableCell>{estate.name}</TableCell>
                            <TableCell>{estate.deceased_name}</TableCell>
                            <TableCell>
                              {new Date(estate.deceased_date).toLocaleDateString('no-NO')}
                            </TableCell>
                            <TableCell>{estate.deceased_id_number}</TableCell>
                            <TableCell>
                              <InviteUserDialog estateId={estate.id} />
                            </TableCell>
                          </TableRow>
                        ))}
                        {estates.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              Ingen aktive bo
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Oversikt;
