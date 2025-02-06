import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { FinanceTransaction, FinanceSummary } from "@/types/finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Boregnskap() {
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
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    console.log('Boregnskap component mounted, user:', user);
    if (user) {
      console.log('User is authenticated, fetching projects and transactions');
      fetchProjects();
    } else {
      console.log('No user found, setting loading to false');
      setLoading(false);
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects...');
      const { data: projectsData, error: projectsError } = await supabase
        .from('estate_projects')
        .select('id, name')
        .or(`responsible_heir_id.eq.${user?.id},id.in.(select project_id from project_users where user_id = ${user?.id})`);

      if (projectsError) throw projectsError;

      console.log('Projects fetched:', projectsData);
      setProjects(projectsData || []);
      
      if (projectsData?.[0]) {
        setSelectedProject(projectsData[0].id);
        fetchTransactions(projectsData[0].id);
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

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      console.log('Transactions fetched:', data);
      setTransactions(data || []);

      // Calculate summary
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

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Boregnskap</h1>
        <Select
          value={selectedProject || ""}
          onValueChange={(value) => {
            setSelectedProject(value);
            fetchTransactions(value);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Velg prosjekt" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {loading ? (
          <p>Laster inn data...</p>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Inntekter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                  }).format(summary.totalIncome)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utgifter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                  }).format(summary.totalExpenses)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Netto Verdi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${summary.netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {new Intl.NumberFormat("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                  }).format(summary.netBalance)}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
