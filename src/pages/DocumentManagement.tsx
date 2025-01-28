import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, FileText, Trash2 } from "lucide-react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  created_at: string;
  user_id: string;
}

const DocumentManagement = () => {
  useProtectedRoute();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      console.log('Fetching documents...');
      const { data: files, error } = await supabase
        .storage
        .from('documents')
        .list();

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }

      console.log('Documents fetched successfully:', files);
      return files.map(file => ({
        id: file.id,
        name: file.name,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || 'unknown',
        created_at: file.created_at,
        url: supabase.storage.from('documents').getPublicUrl(file.name).data.publicUrl
      }));
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      console.log('Uploading file:', file.name);
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`${Date.now()}-${file.name}`, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded.`,
      });
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Error uploading file",
        description: error instanceof Error ? error.message : "An error occurred while uploading the file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = useMutation({
    mutationFn: async (fileName: string) => {
      console.log('Deleting document:', fileName);
      const { error } = await supabase.storage
        .from('documents')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting document:', error);
        throw error;
      }

      console.log('Document deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({
        title: "Document deleted",
        description: "The document has been removed.",
      });
    },
    onError: (error: Error) => {
      console.error('Document deletion error:', error);
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Documents</h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Document Management</h1>

      <div className="mb-8">
        <Button
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={isUploading}
          className="w-full md:w-auto"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Upload Document
        </Button>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents?.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  {doc.name}
                </div>
              </TableCell>
              <TableCell>{doc.type}</TableCell>
              <TableCell>{Math.round(doc.size / 1024)} KB</TableCell>
              <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.url, '_blank')}
                  >
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteDocument.mutate(doc.name)}
                    disabled={deleteDocument.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {documents?.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No documents found. Upload your first document above.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentManagement;