
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/types/tasks";

interface TaskListProps {
  tasks: Task[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return (
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
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
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
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Ingen oppgaver funnet. Opprett din første oppgave ovenfor.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
