
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { House, CreditCard, DollarSign } from "lucide-react";
import { Asset, Liability } from "@/types/finance";

interface SummaryCardsProps {
  assets: Asset[];
  liabilities: Liability[];
}

export const SummaryCards = ({ assets, liabilities }: SummaryCardsProps) => {
  const totalAssets = assets.reduce((sum, asset) => sum + asset.estimated_value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
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
              .format(totalAssets)}
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
              .format(totalLiabilities)}
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
              .format(netWorth)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
