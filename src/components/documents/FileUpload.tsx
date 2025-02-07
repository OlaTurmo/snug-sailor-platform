
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const FileUpload = ({ onUploadComplete }: { onUploadComplete: () => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    if (!user) {
      console.error('No authenticated user found');
      toast({
        title: "Authentication required",
        description: "Please log in to upload documents",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    console.log('Starting upload for user:', user.id);
    
    setIsUploading(true);
    try {
      // Create user-specific folder path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
      
      console.log('Uploading to path:', fileName);

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // Create document record in the database
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          file_path: fileName,
          file_type: file.type,
          uploaded_by: user.id,
          sort_order: 0
        })
        .single();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw dbError;
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      
      onUploadComplete();
    } catch (error) {
      console.error('Upload process failed:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <label htmlFor="file-upload">
        <Button 
          asChild
          disabled={isUploading}
          className="cursor-pointer"
        >
          <span>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Laster opp..." : "Last opp dokument"}
          </span>
        </Button>
      </label>
    </div>
  );
};
