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
        title: "Error",
        description: "Could not fetch projects",
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
        title: "Error",
        description: "Could not fetch financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4 space-y-6">
          <h1 className="text-3xl font-bold">Boregnskap</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 w-[150px] bg-gray-200 animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-[100px] bg-gray-200 animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Boregnskap</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Inntekter fra Salg av Eiendeler</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat("nb-NO", {
                  style: "currency",
                  currency: "NOK",
                }).format(
                  transactions
                    .filter(
                      (t) =>
                        t.type === "income" &&
                        t.category === "sale" &&
                        t.approval_status === "approved"
                    )
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Totale Booppgjørskostnader</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {new Intl.NumberFormat("nb-NO", {
                  style: "currency",
                  currency: "NOK",
                }).format(
                  transactions
                    .filter(
                      (t) =>
                        t.type === "expense" &&
                        t.approval_status === "approved"
                    )
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Budsjett og Utgiftsoversikt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["legal", "tax", "funeral", "other"].map((category) => {
                const amount = transactions
                  .filter(
                    (t) =>
                      t.type === "expense" &&
                      t.category === category &&
                      t.approval_status === "approved"
                  )
                  .reduce((sum, t) => sum + Number(t.amount), 0);
                
                const pendingAmount = transactions
                  .filter(
                    (t) =>
                      t.type === "expense" &&
                      t.category === category &&
                      t.approval_status === "pending"
                  )
                  .reduce((sum, t) => sum + Number(t.amount), 0);

                return (
                  <div
                    key={category}
                    className="flex flex-col space-y-2 p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {category === "legal"
                          ? "Advokatkostnader"
                          : category === "tax"
                          ? "Skatter"
                          : category === "funeral"
                          ? "Begravelseskostnader"
                          : "Andre kostnader"}
                      </span>
                      <div className="text-right">
                        <span className={`font-bold ${amount > 0 ? "text-red-600" : "text-gray-500"}`}>
                          {new Intl.NumberFormat("nb-NO", {
                            style: "currency",
                            currency: "NOK",
                          }).format(amount)}
                        </span>
                        {pendingAmount > 0 && (
                          <div className="text-sm text-amber-600">
                            Ventende godkjenning: {new Intl.NumberFormat("nb-NO", {
                              style: "currency",
                              currency: "NOK",
                            }).format(pendingAmount)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endelig Arveoppgjør</CardTitle>
            <CardDescription>
              Netto verdi tilgjengelig for fordeling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-3xl font-bold text-primary">
                {new Intl.NumberFormat("nb-NO", {
                  style: "currency",
                  currency: "NOK",
                }).format(summary.netBalance)}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Totale Inntekter</h4>
                  <p className="text-green-600">
                    {new Intl.NumberFormat("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                    }).format(summary.totalIncome)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Totale Utgifter</h4>
                  <p className="text-red-600">
                    {new Intl.NumberFormat("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                    }).format(summary.totalExpenses)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}