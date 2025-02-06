
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2 } from "lucide-react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  project_id: string | null;
}

const TaskManagement = () => {
  useProtectedRoute();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  // First, fetch available projects for the user
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      console.log('Fetching projects for user:', user?.id);
      const { data, error } = await supabase
        .from("estate_projects")
        .select("*")
        .or(`responsible_heir_id.eq.${user?.id},id.in.(select project_id from project_users where user_id = ${user?.id})`);

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      console.log('Projects fetched:', data);
      return data;
    },
    enabled: !!user?.id,
  });

  // Use the first project as default if available
  const defaultProjectId = projects?.[0]?.id;

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks", defaultProjectId],
    queryFn: async () => {
      console.log('Fetching tasks for project:', defaultProjectId);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq('project_id', defaultProjectId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      console.log('Tasks fetched:', data);
      return data as Task[];
    },
    enabled: !!defaultProjectId && !!user?.id,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: Partial<Task>) => {
      console.log('Creating new task:', taskData);
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ 
          ...taskData,
          status: 'pending',
          created_by: user?.id,
          assigned_to: user?.id,
          project_id: defaultProjectId
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }

      console.log('Task created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Oppgave opprettet",
        description: "Den nye oppgaven har blitt lagt til.",
      });
      setNewTask({ title: "", description: "", deadline: "" });
    },
    onError: (error: Error) => {
      console.error('Task creation error:', error);
      toast({
        title: "Feil ved opprettelse av oppgave",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: string;
    }) => {
      console.log('Updating task status:', { taskId, status });
      const { data, error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", taskId)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }

      console.log('Task updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Oppgave oppdatert",
        description: "Oppgavestatusen har blitt oppdatert.",
      });
    },
    onError: (error: Error) => {
      console.error('Task update error:', error);
      toast({
        title: "Feil ved oppdatering av oppgave",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "Autentisering kreves",
        description: "Vennligst logg inn for å opprette oppgaver.",
        variant: "destructive",
      });
      return;
    }
    
    if (!defaultProjectId) {
      toast({
        title: "Prosjekt kreves",
        description: "Du må være tilknyttet et prosjekt for å opprette oppgaver.",
        variant: "destructive",
      });
      return;
    }
    
    createTaskMutation.mutate({
      ...newTask,
      deadline: new Date(newTask.deadline).toISOString(),
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Feil ved lasting av oppgaver</h1>
          <p className="text-gray-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Oppgavestyring</h1>

        <form onSubmit={handleCreateTask} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Oppgavetittel"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
            />
            <Input
              placeholder="Beskrivelse"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <Input
              type="datetime-local"
              value={newTask.deadline}
              onChange={(e) =>
                setNewTask({ ...newTask, deadline: e.target.value })
              }
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={createTaskMutation.isPending || !user?.id || !defaultProjectId}
          >
            {createTaskMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2" />
            )}
            Opprett oppgave
          </Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tittel</TableHead>
              <TableHead>Beskrivelse</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Frist</TableHead>
              <TableHead>Handlinger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks?.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  {task.deadline ? new Date(task.deadline).toLocaleString('no-NO') : 'Ingen frist'}
                </TableCell>
                <TableCell>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTaskStatus.mutate({
                        taskId: task.id,
                        status: e.target.value,
                      })
                    }
                    className="border rounded p-1"
                    disabled={updateTaskStatus.isPending}
                  >
                    <option value="pending">Ikke påbegynt</option>
                    <option value="in_progress">Pågår</option>
                    <option value="completed">Fullført</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
            {(!tasks || tasks.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Ingen oppgaver funnet. Opprett din første oppgave ovenfor.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </main>
    </div>
  );
};

export default TaskManagement;

