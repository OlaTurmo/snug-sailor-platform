
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Asset, Liability } from "@/types/finance";
import { AssetsList } from "./AssetsList";
import { LiabilitiesList } from "./LiabilitiesList";
import { OverviewDashboard } from "./OverviewDashboard";

interface ContentTabsProps {
  assets: Asset[];
  liabilities: Liability[];
  setAssets: (assets: Asset[]) => void;
  setLiabilities: (liabilities: Liability[]) => void;
  setShowAddAsset: (show: boolean) => void;
  setShowAddLiability: (show: boolean) => void;
}

export const ContentTabs = ({
  assets,
  liabilities,
  setAssets,
  setLiabilities,
  setShowAddAsset,
  setShowAddLiability,
}: ContentTabsProps) => {
  return (
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
  );
};
