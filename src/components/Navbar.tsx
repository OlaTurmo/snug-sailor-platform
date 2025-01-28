import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] bg-clip-text text-transparent">
          Arv.ing
        </a>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Funksjoner</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900">Priser</a>
          <Button className="bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] hover:opacity-90">
            Kom i gang nå
          </Button>
        </div>
      </div>
    </nav>
  );
};