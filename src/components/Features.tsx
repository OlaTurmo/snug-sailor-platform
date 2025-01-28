import { CheckSquare, Users, FolderOpen, Scale } from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    title: "Guided Prosess",
    description: "Veiledning gjennom hele privat skifte-prosessen.",
  },
  {
    icon: Users,
    title: "Samarbeidsverktøy",
    description: "Del oppgaver og samarbeid med andre arvinger.",
  },
  {
    icon: FolderOpen,
    title: "Dokumenthåndtering",
    description: "Enkel tilgang til skjemaer og viktige dokumenter.",
  },
  {
    icon: Scale,
    title: "Arvefordelingsverktøy",
    description: "Rettferdig fordeling av arv på en smidig måte.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-[#F5F5DC]/10">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Hvorfor velge Arv.ing?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-[#4A90E2] mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};