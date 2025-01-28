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
        <h1 className="text-3xl font-bold">Financial Management</h1>
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
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Økonomistyring</h1>
        <Select
          value={selectedProject || ''}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Inntekt</CardTitle>
            <CardDescription>Kun godkjente transaksjoner</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${summary.totalIncome.toLocaleString('no-NO')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totale Utgifter</CardTitle>
            <CardDescription>Kun godkjente transaksjoner</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ${summary.totalExpenses.toLocaleString('no-NO')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Netto Balanse</CardTitle>
            <CardDescription>Endelig oppgjørsverdi</CardDescription>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                summary.netBalance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${summary.netBalance.toLocaleString('no-NO')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaksjoner</CardTitle>
            <CardDescription>Spor alle økonomiske transaksjoner</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" />
                Legg til Transaksjon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Legg til Ny Transaksjon</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addTransaction({
                    type: formData.get("type") as FinanceTransaction["type"],
                    category: formData.get("category") as string,
                    amount: Number(formData.get("amount")),
                    description: formData.get("description") as string,
                    date: new Date().toISOString(),
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Inntekt</SelectItem>
                      <SelectItem value="expense">Utgift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Velg kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Salg av eiendel</SelectItem>
                      <SelectItem value="legal">Advokatkostnader</SelectItem>
                      <SelectItem value="tax">Skatter</SelectItem>
                      <SelectItem value="funeral">Begravelseskostnader</SelectItem>
                      <SelectItem value="other">Annet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Beløp (kr)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Beskrivelse</Label>
                  <Textarea id="description" name="description" />
                </div>
                <Button type="submit">Legg til Transaksjon</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{transaction.category}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('no-NO')}
                  </p>
                  {transaction.description && (
                    <p className="text-sm">{transaction.description}</p>
                  )}
                  <Badge
                    variant={
                      transaction.approval_status === 'approved'
                        ? 'success'
                        : transaction.approval_status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {transaction.approval_status === 'approved' ? 'Godkjent' : 
                     transaction.approval_status === 'rejected' ? 'Avvist' : 'Venter'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}kr
                    {Number(transaction.amount).toLocaleString('no-NO')}
                  </p>
                  {transaction.approval_status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600"
                        onClick={() => handleApproval(transaction.id, 'approved')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => handleApproval(transaction.id, 'rejected')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}