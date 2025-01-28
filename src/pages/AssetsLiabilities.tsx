import { Navbar } from "@/components/Navbar";
import Finance from "./Finance";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

const AssetsLiabilities = () => {
  useProtectedRoute();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <Finance />
      </main>
    </div>
  );
};

export default AssetsLiabilities;