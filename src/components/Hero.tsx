import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-32 px-4 bg-gradient-to-b from-[#F5F5DC]/20 to-white">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] bg-clip-text text-transparent leading-relaxed">
            En enkel og trygg løsning for arveoppgjør
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Et dødsfall og et arveoppgjør kan være en krevende tid. Arv.ing er her for å gjøre prosessen enklere for deg og dine nærmeste.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] hover:opacity-90 text-lg px-8 py-6"
            >
              Kom i gang nå
            </Button>
            <Button 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={() => navigate("/how-it-works")}
            >
              Les mer om prosessen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};