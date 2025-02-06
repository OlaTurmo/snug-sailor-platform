
import { useState, useEffect } from "react";
import { Plus, X, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TAG_COLORS = [
  '#E5DEFF', // Soft Purple
  '#FDE1D3', // Soft Peach
  '#D3E4FD', // Soft Blue
  '#F2FCE2', // Soft Green
  '#FEF7CD', // Soft Yellow
  '#FEC6A1', // Soft Orange
  '#FFDEE2', // Soft Pink
  '#F1F0FB', // Soft Gray
];

interface Tag {
  id: string;
  name: string;
  color: string;
}

export const TagManagement = ({ onTagsChange }: { onTagsChange: () => void }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
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
        color: selectedColor,
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Circle className="h-4 w-4" style={{ color: selectedColor }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-4 gap-2">
              {TAG_COLORS.map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  className="w-8 h-8 p-0"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
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
            style={{ backgroundColor: tag.color }}
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
