
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
    console.log('Starting file upload process...');
    
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

    console.log('User authenticated:', { userId: user.id });

    const file = event.target.files?.[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    setIsUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      console.log('Generated filename:', fileName);

      console.log('Starting Supabase storage upload...');
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', {
          message: uploadError.message,
          details: uploadError.details,
          hint: uploadError.hint,
          code: uploadError.code
        });
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);

      // Create document record in the database
      console.log('Creating database record...');
      const { error: dbError, data: dbData } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          file_path: fileName,
          file_type: file.type,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database insert error:', {
          message: dbError.message,
          details: dbError.details,
          hint: dbError.hint,
          code: dbError.code
        });
        throw dbError;
      }

      console.log('Database record created:', dbData);

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      onUploadComplete();
    } catch (error) {
      console.error('Upload process failed:', error);
      console.error('Full error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      
      let errorMessage = "Failed to upload document";
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.log('Upload process completed');
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
