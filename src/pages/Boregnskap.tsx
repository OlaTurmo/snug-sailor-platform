
import { Navbar } from "@/components/Navbar";
import { ProjectSelect } from "@/components/boregnskap/ProjectSelect";
import { FinanceSummaryCard } from "@/components/boregnskap/FinanceSummaryCard";
import { useBoregnskap } from "@/hooks/useBoregnskap";

export default function Boregnskap() {
  const {
    loading,
    projects,
    selectedProject,
    summary,
    setSelectedProject,
    fetchTransactions
  } = useBoregnskap();

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Boregnskap</h1>
        
        <ProjectSelect
          projects={projects}
          selectedProject={selectedProject}
          onProjectChange={(value) => {
            setSelectedProject(value);
            fetchTransactions(value);
          }}
        />

        {loading ? (
          <p>Laster inn data...</p>
        ) : (
          <>
            <FinanceSummaryCard
              title="Inntekter"
              amount={summary.totalIncome}
              variant="income"
            />

            <FinanceSummaryCard
              title="Utgifter"
              amount={summary.totalExpenses}
              variant="expense"
            />

            <FinanceSummaryCard
              title="Netto Verdi"
              amount={summary.netBalance}
              variant="net"
            />
          </>
        )}
      </div>
    </>
  );
}
