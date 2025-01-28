import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Arving
        </a>
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};