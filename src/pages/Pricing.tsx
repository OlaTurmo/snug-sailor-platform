import { Navbar } from "@/components/Navbar";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  "Ubegrenset antall brukere",
  "Alle verktøy for arvefordeling",
  "Dokumenthåndtering",
  "Brukerstøtte via chat og e-post",
  "Sikker lagring av data",
  "Eksport av dokumenter",
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-center mb-4">Enkel prising</h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Alt du trenger for å håndtere arveoppgjøret
        </p>
        
        <div className="max-w-lg mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Privat Skifte</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">Kr 3000</span>
              <p className="text-gray-600 mt-1">Per privat skifte</p>
            </div>
            <ul className="mb-8 space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="text-green-500 w-5 h-5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              onClick={() => navigate("/signup")}
              className="w-full bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] hover:opacity-90"
            >
              Kom i gang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;