
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Tag {
  id: string;
  name: string;
  color: string;
}

export const TagManagement = ({ onTagsChange }: { onTagsChange: () => void }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const { toast } = useToast();

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('document_tags')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load tags",
        variant: "destructive",
      });
      return;
    }
    
    setTags(data);
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    const { error } = await supabase
      .from('document_tags')
      .insert({
        name: newTagName.trim(),
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      });
      return;
    }

    setNewTagName("");
    fetchTags();
    onTagsChange();
  };

  const deleteTag = async (tagId: string) => {
    const { error } = await supabase
      .from('document_tags')
      .delete()
      .eq('id', tagId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      });
      return;
    }

    fetchTags();
    onTagsChange();
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="New tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && createTag()}
        />
        <Button onClick={createTag} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => deleteTag(tag.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
