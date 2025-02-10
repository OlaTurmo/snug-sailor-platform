
import { Navbar } from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";

const TaskManagement = () => {
  useProtectedRoute();
  const { user } = useAuth();

  // First, fetch available projects for the user
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      console.log('Fetching projects for user:', user?.id);
      if (!user?.id) {
        console.log('No user ID available');
        return [];
      }

      // First get the project IDs where the user is a member
      const { data: projectUsers, error: projectUsersError } = await supabase
        .from("project_users")
        .select("project_id")
        .eq("user_id", user.id);

      if (projectUsersError) {
        console.error('Error fetching project users:', projectUsersError);
        throw projectUsersError;
      }

      const projectIds = projectUsers?.map(pu => pu.project_id) || [];

      // Then fetch projects where user is either responsible heir or a member
      const { data, error } = await supabase
        .from("estate_projects")
        .select("*")
        .or(`responsible_heir_id.eq.${user.id},id.in.(${projectIds.join(',')})`);

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      console.log('Projects fetched:', data);
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Use the first project as default if available
  const defaultProjectId = projects?.[0]?.id;

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", defaultProjectId],
    queryFn: async () => {
      if (!defaultProjectId) {
        console.log('No default project ID available');
        return [];
      }
      
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
      return data || [];
    },
    enabled: !!defaultProjectId && !!user?.id,
  });

  // Handle loading states
  if (projectsLoading || (tasksLoading && defaultProjectId)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Laster inn...</span>
          </div>
        </div>
      </div>
    );
  }

  // Handle no projects available
  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Ingen prosjekter tilgjengelig</h2>
            <p className="text-gray-600">Du må være tilknyttet minst ett prosjekt for å administrere oppgaver.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Oppgavestyring</h1>

        {user && defaultProjectId && (
          <>
            <TaskForm projectId={defaultProjectId} userId={user.id} />
            <TaskList tasks={tasks || []} />
          </>
        )}
      </main>
    </div>
  );
};

export default TaskManagement;

