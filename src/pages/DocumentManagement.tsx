import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DocumentManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Ingen tilgang",
        description: "Du må være logget inn for å se denne siden",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dokumenthåndtering</h1>
        <div className="grid gap-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Mine Dokumenter</h2>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <p className="text-muted-foreground mb-4">
                Ingen dokumenter lastet opp ennå
              </p>
              <Button>Last opp dokument</Button>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Nylige Aktiviteter</h2>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <p className="text-muted-foreground">Ingen nylige aktiviteter</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DocumentManagement;