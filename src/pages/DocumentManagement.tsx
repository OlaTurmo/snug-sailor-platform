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
import { useAuth } from "@/contexts/AuthContext";

interface Document {
  id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

const DocumentManagement = () => {
  useProtectedRoute();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      console.log('Fetching documents...');
      const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (docsError) {
        console.error('Error fetching documents:', docsError);
        throw docsError;
      }

      console.log('Documents fetched successfully:', docs);
      return docs as Document[];
    },
    enabled: !!user?.id,
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    try {
      console.log('Uploading file:', file.name);
      
      // First upload to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading to storage:', uploadError);
        throw uploadError;
      }

      // Then create database record
      const { error: dbError } = await supabase
        .from('documents')
        .insert([{
          name: file.name,
          file_path: fileName,
          file_type: file.type,
          uploaded_by: user.id
        }]);

      if (dbError) {
        console.error('Error creating document record:', dbError);
        throw dbError;
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
    mutationFn: async (document: Document) => {
      console.log('Deleting document:', document);
      
      // First delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
        throw storageError;
      }

      // Then delete database record
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (dbError) {
        console.error('Error deleting document record:', dbError);
        throw dbError;
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
          disabled={isUploading || !user?.id}
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
              <TableCell>{doc.file_type}</TableCell>
              <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = supabase.storage
                        .from('documents')
                        .getPublicUrl(doc.file_path).data.publicUrl;
                      window.open(url, '_blank');
                    }}
                  >
                    View
                  </Button>
                  {doc.uploaded_by === user?.id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteDocument.mutate(doc)}
                      disabled={deleteDocument.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(!documents || documents.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
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