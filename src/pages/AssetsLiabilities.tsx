
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useToast } from "@/components/ui/use-toast";
import { Asset, Liability } from "@/types/finance";
import { AddAssetDialog } from "@/components/assets/AddAssetDialog";
import { AddLiabilityDialog } from "@/components/assets/AddLiabilityDialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { SummaryCards } from "@/components/assets/SummaryCards";
import { LoadingSpinner } from "@/components/assets/LoadingSpinner";
import { ContentTabs } from "@/components/assets/ContentTabs";
import { useFinanceData } from "@/hooks/useFinanceData";

const AssetsLiabilities = () => {
  useProtectedRoute();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddLiability, setShowAddLiability] = useState(false);
  const { assets, setAssets, liabilities, setLiabilities, isLoading } = useFinanceData(user);

  const handleAddAsset = async (asset: Omit<Asset, 'id' | 'estate_project_id'>) => {
    try {
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

      setAssets([...assets, data as Asset]);
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

  const handleAddLiability = async (liability: Omit<Liability, 'id' | 'estate_project_id'>) => {
    try {
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

      setLiabilities([...liabilities, data as Liability]);
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
    return <LoadingSpinner />;
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

        <SummaryCards assets={assets} liabilities={liabilities} />

        <ContentTabs
          assets={assets}
          liabilities={liabilities}
          setAssets={setAssets}
          setLiabilities={setLiabilities}
          setShowAddAsset={setShowAddAsset}
          setShowAddLiability={setShowAddLiability}
        />

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
