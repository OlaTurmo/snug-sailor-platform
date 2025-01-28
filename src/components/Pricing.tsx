import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Gratis",
    price: "0 kr",
    features: ["Grunnleggende verktøy for privat skifte", "Tilgang til maler", "E-post support", "2GB lagring"],
  },
  {
    name: "Premium",
    price: "199 kr",
    features: ["Avanserte arvefordelingsverktøy", "Ubegrenset lagring", "Prioritert support", "Profesjonell konsultasjon"],
  },
  {
    name: "Enterprise",
    price: "Kontakt oss",
    features: ["Skreddersydde løsninger", "Juridisk rådgivning", "24/7 support", "Meglingstjenester"],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">En løsning for alle behov</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border"
            >
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "Kontakt oss" && <span className="text-gray-600">/mnd</span>}
              </div>
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="text-[#4A90E2] w-5 h-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] hover:opacity-90">
                Kom i gang
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};