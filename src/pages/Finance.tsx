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
import { Button } from "@/components/ui/button";
import { Plus, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Finance() {
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
    console.log('Finance component mounted, user:', user);
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
        .eq('project_id', projectId)  // Changed from estate_project_id to project_id
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
        title: "Error",
        description: "Could not fetch financial data",
        variant: "destructive",
      });
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const addTransaction = async (data: Partial<FinanceTransaction>) => {
    try {
      console.log('Adding transaction:', data);
      const { error } = await supabase.from("finance_transactions").insert([
        {
          ...data,
          created_by: user?.id,
          project_id: selectedProject,  // Changed from estate_project_id to project_id
          approval_status: 'pending'
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      fetchTransactions(selectedProject!);
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Could not add transaction",
        variant: "destructive",
      });
    }
  };

  const handleApproval = async (transactionId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('finance_transactions')
        .update({
          approval_status: status,
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Transaction ${status}`,
      });
      fetchTransactions(selectedProject!);
    } catch (error) {
      console.error(`Error ${status} transaction:`, error);
      toast({
        title: "Error",
        description: `Could not ${status} transaction`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Økonomistyring</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Eiendeler og Gjeld</h1>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Totale Eiendeler</CardTitle>
            <CardDescription>Kun godkjente verdier</CardDescription>
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
            <CardTitle>Total Gjeld</CardTitle>
            <CardDescription>Kun godkjente verdier</CardDescription>
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
            <CardDescription>Endelig oppgjørsverdi</CardDescription>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                summary.netBalance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {new Intl.NumberFormat("nb-NO", {
                style: "currency",
                currency: "NOK",
              }).format(summary.netBalance)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="boregnskap" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="oversikt">Oversikt</TabsTrigger>
          <TabsTrigger value="eiendeler">Eiendeler</TabsTrigger>
          <TabsTrigger value="gjeld">Gjeld</TabsTrigger>
          <TabsTrigger value="boregnskap">Boregnskap</TabsTrigger>
        </TabsList>

        <TabsContent value="oversikt">
          <Card>
            <CardHeader>
              <CardTitle>Oversikt</CardTitle>
              <CardDescription>Generell oversikt over økonomien</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Innhold for oversikt her...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eiendeler">
          <Card>
            <CardHeader>
              <CardTitle>Eiendeler</CardTitle>
              <CardDescription>Liste over eiendeler</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Innhold for eiendeler her...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gjeld">
          <Card>
            <CardHeader>
              <CardTitle>Gjeld</CardTitle>
              <CardDescription>Liste over gjeld</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Innhold for gjeld her...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boregnskap">
          <Card>
            <CardHeader>
              <CardTitle>Boregnskap</CardTitle>
              <CardDescription>
                Detaljert økonomisk oversikt for booppgjøret
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Budget Tracker Section */}
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

                {/* Expense Categories */}
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

                {/* Final Settlement Summary */}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}