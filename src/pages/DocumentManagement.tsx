
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FileUpload } from "@/components/documents/FileUpload";
import { DocumentList } from "@/components/documents/DocumentList";

const DocumentManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleDocumentChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dokumenthåndtering</h1>
          <FileUpload onUploadComplete={handleDocumentChange} />
        </div>

        <div className="grid gap-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Mine Dokumenter</h2>
            <DocumentList 
              key={refreshKey} 
              onDocumentDeleted={handleDocumentChange} 
            />
          </section>
        </div>
      </main>
    </div>
  );
};

export default DocumentManagement;
