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

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in_progress" | "completed";
  due_date: string;
  assigned_to: string;
}

const TaskManagement = () => {
  useProtectedRoute(); // Add protected route hook
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "",
    due_date: "",
  });

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      console.log('Fetching tasks...');
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      console.log('Tasks fetched successfully:', data);
      return data as Task[];
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<Task, "id">) => {
      console.log('Creating new task:', taskData);
      const { data, error } = await supabase
        .from("tasks")
        .insert([taskData])
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
        title: "Task created successfully",
        description: "The new task has been added to the list.",
      });
      setNewTask({ title: "", description: "", category: "", due_date: "" });
    },
    onError: (error: Error) => {
      console.error('Task creation error:', error);
      toast({
        title: "Error creating task",
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
      status: Task["status"];
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
        title: "Task updated",
        description: "The task status has been updated.",
      });
    },
    onError: (error: Error) => {
      console.error('Task update error:', error);
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate({
      ...newTask,
      status: "pending",
      assigned_to: "", // You'll need to implement user selection
    } as Omit<Task, "id">);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Tasks</h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Task Management</h1>

      <form onSubmit={handleCreateTask} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
          />
          <Input
            placeholder="Category"
            value={newTask.category}
            onChange={(e) =>
              setNewTask({ ...newTask, category: e.target.value })
            }
          />
          <Input
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <Input
            type="date"
            value={newTask.due_date}
            onChange={(e) =>
              setNewTask({ ...newTask, due_date: e.target.value })
            }
          />
        </div>
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={createTaskMutation.isPending}
        >
          {createTaskMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2" />
          )}
          Create Task
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks?.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.category}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                {new Date(task.due_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateTaskStatus.mutate({
                      taskId: task.id,
                      status: e.target.value as Task["status"],
                    })
                  }
                  className="border rounded p-1"
                  disabled={updateTaskStatus.isPending}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </TableCell>
            </TableRow>
          ))}
          {tasks?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No tasks found. Create your first task above.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskManagement;