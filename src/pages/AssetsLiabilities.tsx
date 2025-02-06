
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, DollarSign, CreditCard, House, Car, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Asset, AssetType, Liability, LiabilityType } from "@/types/finance";
import { AddAssetDialog } from "@/components/assets/AddAssetDialog";
import { AddLiabilityDialog } from "@/components/assets/AddLiabilityDialog";
import { AssetsList } from "@/components/assets/AssetsList";
import { LiabilitiesList } from "@/components/assets/LiabilitiesList";
import { OverviewDashboard } from "@/components/assets/OverviewDashboard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AssetsLiabilities = () => {
  useProtectedRoute();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddLiability, setShowAddLiability] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // First, get the estate project for this user
        const { data: projectData, error: projectError } = await supabase
          .from('estate_projects')
          .select('id')
          .eq('responsible_heir_id', user.id)
          .maybeSingle();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          return;
        }

        if (!projectData) {
          console.log('No project found for user');
          return;
        }

        // Fetch assets
        const { data: assetsData, error: assetsError } = await supabase
          .from('assets')
          .select('*')
          .eq('estate_project_id', projectData.id);

        if (assetsError) {
          console.error('Error fetching assets:', assetsError);
        } else {
          setAssets(assetsData || []);
        }

        // Fetch liabilities
        const { data: liabilitiesData, error: liabilitiesError } = await supabase
          .from('liabilities')
          .select('*')
          .eq('estate_project_id', projectData.id);

        if (liabilitiesError) {
          console.error('Error fetching liabilities:', liabilitiesError);
        } else {
          setLiabilities(liabilitiesData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAddAsset = async (asset: Asset) => {
    try {
      // Get the project ID first
      const { data: projectData } = await supabase
        .from('estate_projects')
        .select('id')
        .eq('responsible_heir_id', user?.id)
        .maybeSingle();

      if (!projectData) {
        toast({
          title: "Feil",
          description: "Kunne ikke finne prosjekt-ID.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('assets')
        .insert([{ ...asset, estate_project_id: projectData.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setAssets([...assets, data]);
      setShowAddAsset(false);
      toast({
        title: "Eiendel lagt til",
        description: "Eiendelen har blitt lagt til i oversikten.",
      });
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke legge til eiendel.",
        variant: "destructive",
      });
    }
  };

  const handleAddLiability = async (liability: Liability) => {
    try {
      // Get the project ID first
      const { data: projectData } = await supabase
        .from('estate_projects')
        .select('id')
        .eq('responsible_heir_id', user?.id)
        .maybeSingle();

      if (!projectData) {
        toast({
          title: "Feil",
          description: "Kunne ikke finne prosjekt-ID.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('liabilities')
        .insert([{ ...liability, estate_project_id: projectData.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setLiabilities([...liabilities, data]);
      setShowAddLiability(false);
      toast({
        title: "Gjeld lagt til",
        description: "Gjelden har blitt lagt til i oversikten.",
      });
    } catch (error) {
      console.error('Error adding liability:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke legge til gjeld.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Eiendeler og Gjeld</h1>
          <p className="text-gray-600">
            Administrer og spor alle eiendeler og gjeld i boet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <House className="h-5 w-5" />
                Totale Eiendeler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' })
                  .format(assets.reduce((sum, asset) => sum + asset.estimated_value, 0))}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Total Gjeld
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' })
                  .format(liabilities.reduce((sum, liability) => sum + liability.amount, 0))}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Netto Verdi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' })
                  .format(
                    assets.reduce((sum, asset) => sum + asset.estimated_value, 0) -
                    liabilities.reduce((sum, liability) => sum + liability.amount, 0)
                  )}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Oversikt</TabsTrigger>
            <TabsTrigger value="assets">Eiendeler</TabsTrigger>
            <TabsTrigger value="liabilities">Gjeld</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewDashboard assets={assets} liabilities={liabilities} />
          </TabsContent>

          <TabsContent value="assets">
            <div className="mb-4">
              <Button onClick={() => setShowAddAsset(true)} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Legg til Eiendel
              </Button>
            </div>
            <AssetsList assets={assets} setAssets={setAssets} />
          </TabsContent>

          <TabsContent value="liabilities">
            <div className="mb-4">
              <Button onClick={() => setShowAddLiability(true)} className="flex items-center gap-2">
                <MinusCircle className="h-4 w-4" />
                Legg til Gjeld
              </Button>
            </div>
            <LiabilitiesList liabilities={liabilities} setLiabilities={setLiabilities} />
          </TabsContent>
        </Tabs>

        <AddAssetDialog
          open={showAddAsset}
          onOpenChange={setShowAddAsset}
          onAdd={handleAddAsset}
        />
        <AddLiabilityDialog
          open={showAddLiability}
          onOpenChange={setShowAddLiability}
          onAdd={handleAddLiability}
        />
      </main>
    </div>
  );
};

export default AssetsLiabilities;
