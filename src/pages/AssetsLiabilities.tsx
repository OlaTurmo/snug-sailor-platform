import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Asset, Liability } from "@/types/finance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, DollarSign, Trash2 } from "lucide-react";
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

export default function AssetsLiabilities() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalLiabilities, setTotalLiabilities] = useState(0);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [assetsResult, liabilitiesResult] = await Promise.all([
        supabase.from("assets").select("*"),
        supabase.from("liabilities").select("*"),
      ]);

      if (assetsResult.error) throw assetsResult.error;
      if (liabilitiesResult.error) throw liabilitiesResult.error;

      setAssets(assetsResult.data || []);
      setLiabilities(liabilitiesResult.data || []);

      // Calculate totals
      const assetsTotal = (assetsResult.data || []).reduce(
        (sum, asset) => sum + Number(asset.estimated_value),
        0
      );
      const liabilitiesTotal = (liabilitiesResult.data || []).reduce(
        (sum, liability) => sum + Number(liability.amount),
        0
      );

      setTotalAssets(assetsTotal);
      setTotalLiabilities(liabilitiesTotal);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Could not fetch financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAsset = async (data: Partial<Asset>) => {
    try {
      const { error } = await supabase.from("assets").insert([
        {
          ...data,
          created_by: user?.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Asset added successfully",
      });
      fetchData();
    } catch (error) {
      console.error("Error adding asset:", error);
      toast({
        title: "Error",
        description: "Could not add asset",
        variant: "destructive",
      });
    }
  };

  const addLiability = async (data: Partial<Liability>) => {
    try {
      const { error } = await supabase.from("liabilities").insert([
        {
          ...data,
          created_by: user?.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Liability added successfully",
      });
      fetchData();
    } catch (error) {
      console.error("Error adding liability:", error);
      toast({
        title: "Error",
        description: "Could not add liability",
        variant: "destructive",
      });
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const { error } = await supabase.from("assets").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Asset deleted successfully",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast({
        title: "Error",
        description: "Could not delete asset",
        variant: "destructive",
      });
    }
  };

  const deleteLiability = async (id: string) => {
    try {
      const { error } = await supabase
        .from("liabilities")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Liability deleted successfully",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting liability:", error);
      toast({
        title: "Error",
        description: "Could not delete liability",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Assets and Liabilities</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${totalAssets.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ${totalLiabilities.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                totalAssets - totalLiabilities >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ${(totalAssets - totalLiabilities).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assets Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Assets</CardTitle>
            <CardDescription>Track all estate assets</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addAsset({
                    name: formData.get("name") as string,
                    type: formData.get("type") as Asset["type"],
                    description: formData.get("description") as string,
                    estimated_value: Number(formData.get("estimated_value")),
                    status: "active",
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property">Property</SelectItem>
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="bank_account">Bank Account</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="valuable">Valuable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div>
                  <Label htmlFor="estimated_value">Estimated Value ($)</Label>
                  <Input
                    id="estimated_value"
                    name="estimated_value"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <Button type="submit">Add Asset</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{asset.name}</h3>
                  <p className="text-sm text-gray-500">{asset.type}</p>
                  {asset.description && (
                    <p className="text-sm">{asset.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-green-600">
                    ${Number(asset.estimated_value).toLocaleString()}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAsset(asset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liabilities Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Liabilities</CardTitle>
            <CardDescription>Track all estate debts</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" />
                Add Liability
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Liability</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addLiability({
                    name: formData.get("name") as string,
                    type: formData.get("type") as Liability["type"],
                    amount: Number(formData.get("amount")),
                    due_date: formData.get("due_date") as string,
                    status: "pending",
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debt">Debt</SelectItem>
                      <SelectItem value="tax">Tax</SelectItem>
                      <SelectItem value="bill">Bill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
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
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input id="due_date" name="due_date" type="date" />
                </div>
                <Button type="submit">Add Liability</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liabilities.map((liability) => (
              <div
                key={liability.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{liability.name}</h3>
                  <p className="text-sm text-gray-500">{liability.type}</p>
                  {liability.due_date && (
                    <p className="text-sm">
                      Due: {new Date(liability.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-red-600">
                    ${Number(liability.amount).toLocaleString()}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLiability(liability.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}