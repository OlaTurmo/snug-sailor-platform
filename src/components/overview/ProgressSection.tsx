
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

interface ProgressSectionProps {
  progress: number;
  completedTasks: number;
  totalTasks: number;
}

export const ProgressSection = ({ progress, completedTasks, totalTasks }: ProgressSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Fremdrift
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="h-2" />
        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <span>{Math.round(progress)}% fullført</span>
          <span>{completedTasks} av {totalTasks} oppgaver fullført</span>
        </div>
      </CardContent>
    </Card>
  );
};
