
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Liability } from "@/types/finance";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface LiabilitiesListProps {
  liabilities: Liability[];
  setLiabilities: (liabilities: Liability[]) => void;
}

export const LiabilitiesList = ({ liabilities, setLiabilities }: LiabilitiesListProps) => {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('liabilities')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setLiabilities(liabilities.filter(liability => liability.id !== id));
      toast({
        title: "Gjeld slettet",
        description: "Gjelden har blitt slettet fra oversikten.",
      });
    } catch (error) {
      console.error('Error deleting liability:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke slette gjelden.",
        variant: "destructive",
      });
    }
  };

  const getLiabilityTypeLabel = (type: Liability["type"]) => {
    const types = {
      debt: "Gjeld",
      tax: "Skatt",
      bill: "Regning"
    };
    return types[type];
  };

  return (
    <div className="space-y-4">
      {liabilities.map((liability) => (
        <Card key={liability.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{liability.name}</span>
              <button
                onClick={() => handleDelete(liability.id)}
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
                <p>{getLiabilityTypeLabel(liability.type)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Beløp</p>
                <p>
                  {new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' })
                    .format(liability.amount)}
                </p>
              </div>
              {liability.due_date && (
                <div>
                  <p className="text-sm text-gray-500">Forfallsdato</p>
                  <p>{format(new Date(liability.due_date), 'PP', { locale: nb })}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {liabilities.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          Ingen gjeld lagt til ennå.
        </p>
      )}
    </div>
  );
};
