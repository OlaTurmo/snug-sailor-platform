import { Navbar } from "@/components/Navbar";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Registrer deg",
    description: "Opprett en konto for å komme i gang med arveoppgjøret.",
  },
  {
    title: "Inviter arvinger",
    description: "Del tilgang med andre arvinger og samarbeid om oppgjøret.",
  },
  {
    title: "Registrer eiendeler",
    description: "Legg inn alle eiendeler og gjeld i boet.",
  },
  {
    title: "Fordel verdier",
    description: "Bruk våre verktøy for å fordele verdier rettferdig.",
  },
  {
    title: "Fullfør oppgjøret",
    description: "Gjennomfør det formelle oppgjøret med vår veiledning.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-center mb-12">Slik fungerer Arv.ing</h1>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <CheckCircle2 className="text-green-500 w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;