import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";

const Oversikt = () => {
  const { user, logout } = useAuth();
  useProtectedRoute();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold mb-4">
              Velkommen {user?.name}
            </h1>
            <p className="text-gray-600 mb-6">
              Dette er din oversikt over arveoppgjør og oppgaver.
            </p>
            
            {/* Placeholder for future content */}
            <div className="grid gap-4">
              <div className="border rounded-lg p-4">
                <h2 className="font-semibold mb-2">Aktive arveoppgjør</h2>
                <p className="text-gray-500">Ingen aktive arveoppgjør enda.</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h2 className="font-semibold mb-2">Siste aktivitet</h2>
                <p className="text-gray-500">Ingen nylig aktivitet.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Oversikt;