
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FinanceSummaryCardProps {
  title: string;
  amount: number;
  variant?: 'default' | 'income' | 'expense' | 'net';
}

export const FinanceSummaryCard = ({ 
  title, 
  amount, 
  variant = 'default' 
}: FinanceSummaryCardProps) => {
  const getTextColorClass = () => {
    switch (variant) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'net':
        return amount >= 0 ? 'text-green-600' : 'text-red-600';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${getTextColorClass()}`}>
          {new Intl.NumberFormat("nb-NO", {
            style: "currency",
            currency: "NOK",
          }).format(amount)}
        </p>
      </CardContent>
    </Card>
  );
};
