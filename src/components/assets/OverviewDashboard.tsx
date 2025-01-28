import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Asset, Liability } from "@/types/finance";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface OverviewDashboardProps {
  assets: Asset[];
  liabilities: Liability[];
}

export const OverviewDashboard = ({ assets, liabilities }: OverviewDashboardProps) => {
  const assetsByType = assets.reduce((acc, asset) => {
    const type = getAssetTypeLabel(asset.type);
    acc[type] = (acc[type] || 0) + asset.estimated_value;
    return acc;
  }, {} as Record<string, number>);

  const liabilitiesByType = liabilities.reduce((acc, liability) => {
    const type = getLiabilityTypeLabel(liability.type);
    acc[type] = (acc[type] || 0) + liability.amount;
    return acc;
  }, {} as Record<string, number>);

  const assetData = Object.entries(assetsByType).map(([name, value]) => ({ name, value }));
  const liabilityData = Object.entries(liabilitiesByType).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  function getAssetTypeLabel(type: Asset["type"]) {
    const types = {
      property: "Eiendom",
      vehicle: "Kjøretøy",
      bank_account: "Bankkonto",
      stock: "Aksjer",
      valuable: "Verdisaker"
    };
    return types[type];
  }

  function getLiabilityTypeLabel(type: Liability["type"]) {
    const types = {
      debt: "Gjeld",
      tax: "Skatt",
      bill: "Regning"
    };
    return types[type];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Fordeling av Eiendeler</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {assetData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => 
                    new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' })
                      .format(value)
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Ingen eiendeler lagt til ennå.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fordeling av Gjeld</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {liabilityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={liabilityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {liabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => 
                    new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK' })
                      .format(value)
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Ingen gjeld lagt til ennå.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};