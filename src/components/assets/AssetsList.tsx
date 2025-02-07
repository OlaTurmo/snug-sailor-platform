
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Asset } from "@/types/finance";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface AssetsListProps {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
}

export const AssetsList = ({ assets, setAssets }: AssetsListProps) => {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setAssets(assets.filter(asset => asset.id !== id));
      toast({
        title: "Eiendel slettet",
        description: "Eiendelen har blitt slettet fra oversikten.",
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette eiendelen.",
        variant: "destructive",
      });
    }
  };

  const getAssetTypeLabel = (type: Asset["type"]) => {
    const types = {
      property: "Eiendom",
      vehicle: "Kjøretøy",
      bank_account: "Bankkonto",
      stock: "Aksjer",
      valuable: "Verdisaker"
    };
    return types[type];
  };

  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <Card key={asset.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{asset.name}</span>
              <button
                onClick={() => handleDelete(asset.id)}
                className="text-red-500 hover:text-red-700"
              >
                Slett
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p>{getAssetTypeLabel(asset.type)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimert Verdi</p>
                <p>
                  {new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' })
                    .format(asset.estimated_value)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Verdivurderingsdato</p>
                <p>{format(new Date(asset.valuation_date), 'PP', { locale: nb })}</p>
              </div>
              {asset.description && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Beskrivelse</p>
                  <p>{asset.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {assets.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          Ingen eiendeler lagt til ennå.
        </p>
      )}
    </div>
  );
};
