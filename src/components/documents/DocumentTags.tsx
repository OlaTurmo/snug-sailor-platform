
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Tag {
  id: string;
  name: string;
}

interface DocumentTagsProps {
  documentId: string;
  onTagsChange: () => void;
}

export const DocumentTags = ({ documentId, onTagsChange }: DocumentTagsProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [documentTags, setDocumentTags] = useState<Tag[]>([]);
  const { toast } = useToast();

  const fetchTags = async () => {
    const { data: allTags, error: tagsError } = await supabase
      .from('document_tags')
      .select('*')
      .order('name');

    if (tagsError) {
      toast({
        title: "Error",
        description: "Failed to load tags",
        variant: "destructive",
      });
      return;
    }

    const { data: docTags, error: docTagsError } = await supabase
      .from('document_tag_relations')
      .select('tag_id')
      .eq('document_id', documentId);

    if (docTagsError) {
      toast({
        title: "Error",
        description: "Failed to load document tags",
        variant: "destructive",
      });
      return;
    }

    const docTagIds = docTags.map(dt => dt.tag_id);
    setTags(allTags);
    setDocumentTags(allTags.filter(tag => docTagIds.includes(tag.id)));
  };

  const addTag = async (tagId: string) => {
    const { error } = await supabase
      .from('document_tag_relations')
      .insert({
        document_id: documentId,
        tag_id: tagId,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive",
      });
      return;
    }

    fetchTags();
    onTagsChange();
  };

  const removeTag = async (tagId: string) => {
    const { error } = await supabase
      .from('document_tag_relations')
      .delete()
      .match({
        document_id: documentId,
        tag_id: tagId,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove tag",
        variant: "destructive",
      });
      return;
    }

    fetchTags();
    onTagsChange();
  };

  useEffect(() => {
    fetchTags();
  }, [documentId]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {documentTags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="cursor-pointer"
          onClick={() => removeTag(tag.id)}
        >
          {tag.name}
        </Badge>
      ))}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48">
          <div className="space-y-2">
            {tags
              .filter(tag => !documentTags.find(dt => dt.id === tag.id))
              .map(tag => (
                <Button
                  key={tag.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => addTag(tag.id)}
                >
                  {tag.name}
                </Button>
              ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
