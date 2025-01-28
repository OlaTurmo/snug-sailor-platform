import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Enkel prising</h2>
        <p className="text-xl text-center text-gray-600 mb-12">Alt du trenger for å håndtere arveoppgjøret</p>
        
        <div className="max-w-lg mx-auto">
          <div className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border">
            <h3 className="text-2xl font-bold mb-2">Privat Skifte</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">Kr 3000</span>
              <p className="text-gray-600 mt-1">Per privat skifte, uavhengig av antall brukere</p>
            </div>
            <ul className="mb-8 space-y-4">
              <li className="flex items-center gap-2">
                <Check className="text-[#4A90E2] w-5 h-5" />
                <span>Ubegrenset antall brukere</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-[#4A90E2] w-5 h-5" />
                <span>Alle verktøy for arvefordeling</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-[#4A90E2] w-5 h-5" />
                <span>Dokumenthåndtering</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-[#4A90E2] w-5 h-5" />
                <span>Brukerstøtte via chat og e-post</span>
              </li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] hover:opacity-90">
              Kom i gang
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};