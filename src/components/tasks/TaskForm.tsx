
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2 } from "lucide-react";
import { Task } from "@/types/tasks";

interface TaskFormProps {
  projectId: string;
  userId: string;
}

export const TaskForm = ({ projectId, userId }: TaskFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: Partial<Task>) => {
      console.log('Creating new task:', taskData);
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ 
          ...taskData,
          status: 'pending',
          created_by: userId,
          assigned_to: userId,
          project_id: projectId
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTaskMutation.mutate({
      ...newTask,
      deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Oppgavetittel"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <Input
          placeholder="Beskrivelse"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <Input
          type="datetime-local"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
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
        Opprett oppgave
      </Button>
    </form>
  );
};
