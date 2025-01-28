import { Navbar } from "@/components/Navbar";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

const CollaborationTools = () => {
  useProtectedRoute();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">Samarbeid</h1>
        {/* Content will be implemented later */}
      </main>
    </div>
  );
};

export default CollaborationTools;