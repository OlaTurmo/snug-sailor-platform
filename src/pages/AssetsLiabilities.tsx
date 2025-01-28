import { useState } from "react";
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

const AssetsLiabilities = () => {
  useProtectedRoute();
  const { toast } = useToast();
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showAddLiability, setShowAddLiability] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);

  const handleAddAsset = (asset: Asset) => {
    setAssets([...assets, asset]);
    setShowAddAsset(false);
    toast({
      title: "Eiendel lagt til",
      description: "Eiendelen har blitt lagt til i oversikten.",
    });
  };

  const handleAddLiability = (liability: Liability) => {
    setLiabilities([...liabilities, liability]);
    setShowAddLiability(false);
    toast({
      title: "Gjeld lagt til",
      description: "Gjelden har blitt lagt til i oversikten.",
    });
  };

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