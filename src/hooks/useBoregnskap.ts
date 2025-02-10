
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FinanceTransaction, FinanceSummary } from "@/types/finance";

interface Project {
  id: string;
  name: string;
}

interface ProjectUserResult {
  project_id: string;
  estate_projects: {
    id: string;
    name: string;
  };
}

export const useBoregnskap = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [summary, setSummary] = useState<FinanceSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects...');
      
      const { data: responsibleProjects, error: responsibleError } = await supabase
        .from('estate_projects')
        .select('id, name')
        .eq('responsible_heir_id', user?.id);

      if (responsibleError) throw responsibleError;

      const { data: memberProjects, error: memberError } = await supabase
        .from('project_users')
        .select('project_id, estate_projects!inner(id, name)')
        .eq('user_id', user?.id);

      if (memberError) throw memberError;

      const combinedProjects: Project[] = [
        ...(responsibleProjects || []),
        ...(memberProjects || []).map((mp: ProjectUserResult) => ({
          id: mp.estate_projects.id,
          name: mp.estate_projects.name
        }))
      ];

      const uniqueProjects = Array.from(
        new Map(combinedProjects.map(p => [p.id, p])).values()
      );

      console.log('Projects fetched:', uniqueProjects);
      setProjects(uniqueProjects);
      
      if (uniqueProjects[0]) {
        setSelectedProject(uniqueProjects[0].id);
        fetchTransactions(uniqueProjects[0].id);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke hente prosjekter",
        variant: "destructive",
      });
    }
  };

  const fetchTransactions = async (projectId: string) => {
    try {
      console.log('Fetching transactions for project:', projectId);
      const { data, error } = await supabase
        .from("finance_transactions")
        .select("*")
        .eq('project_id', projectId)
        .order("date", { ascending: false });

      if (error) throw error;

      console.log('Transactions fetched:', data);
      setTransactions(data || []);

      const income = (data || [])
        .filter(t => t.type === 'income' && t.approval_status === 'approved')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const expenses = (data || [])
        .filter(t => t.type === 'expense' && t.approval_status === 'approved')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setSummary({
        totalIncome: income,
        totalExpenses: expenses,
        netBalance: income - expenses,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke hente finansdata",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Boregnskap hook mounted, user:', user);
    if (user) {
      console.log('User is authenticated, fetching projects and transactions');
      fetchProjects();
    } else {
      console.log('No user found, setting loading to false');
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    projects,
    selectedProject,
    summary,
    setSelectedProject,
    fetchTransactions
  };
};
