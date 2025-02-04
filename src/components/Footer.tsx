
import { Twitter, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#F5F5DC]/10 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Arv.ing</h3>
            <p className="text-gray-600">
              Vi gjør arveoppgjør enklere for alle.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produkt</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-gray-900">Funksjoner</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-gray-900">Priser</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Maler</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Selskap</h4>
            <ul className="space-y-2">
              <li><a href="/about-us" className="text-gray-600 hover:text-gray-900">Om oss</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Blogg</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Karriere</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Følg oss</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-[#4A90E2]">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#4A90E2]">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#4A90E2]">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-gray-600">
          <p>&copy; 2024 Arv.ing. Alle rettigheter forbeholdt.</p>
        </div>
      </div>
    </footer>
  );
};
