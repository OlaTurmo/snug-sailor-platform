import { useEffect, useState } from "react";
import { FileText, Download, Trash2, ChevronDown, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { TagManagement } from "./TagManagement";
import { DocumentTags } from "./DocumentTags";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DocumentItem {
  id: string;
  name: string;
  file_path: string;
  created_at: string;
  file_type: string;
  sort_order: number;
  tags: string[];
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

type SortField = 'name' | 'created_at' | 'file_type' | 'sort_order';
type SortOrder = 'asc' | 'desc';

export const DocumentList = ({ onDocumentDeleted }: { onDocumentDeleted: () => void }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('sort_order');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('document_tags')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching tags:', error);
      return;
    }
    
    setTags(data);
  };

  const fetchDocuments = async () => {
    try {
      let query = supabase
        .from('documents')
        .select(`
          *,
          document_tag_relations(tag_id)
        `)
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (selectedTags.length > 0) {
        query = query.in('document_tag_relations.tag_id', selectedTags);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchDocuments();
  }, [sortField, sortOrder, selectedTags]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(documents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort_order for all affected items
    for (let i = 0; i < items.length; i++) {
      const { error } = await supabase
        .from('documents')
        .update({ sort_order: i })
        .eq('id', items[i].id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update document order",
          variant: "destructive",
        });
        return;
      }
    }

    setDocuments(items);
  };

  const handleBulkTagAdd = async (tagId: string) => {
    const { error } = await supabase
      .from('document_tag_relations')
      .insert(
        selectedDocuments.map(docId => ({
          document_id: docId,
          tag_id: tagId,
        }))
      );

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add tags",
        variant: "destructive",
      });
      return;
    }

    fetchDocuments();
    setSelectedDocuments([]);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleDownload = async (document: DocumentItem) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.file_path);

      if (error) throw error;

      // Create a download link
      const url = window.URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (document: DocumentItem) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      onDocumentDeleted();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Laster dokumenter...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            className="cursor-pointer"
            style={{ backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined }}
            onClick={() => toggleTag(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>

      <TagManagement onTagsChange={fetchTags} />

      {selectedDocuments.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">
            {selectedDocuments.length} documents selected
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <TagIcon className="h-4 w-4 mr-2" />
                Add Tags
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Tags to Selected Documents</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant="outline"
                    className="justify-start"
                    style={{ backgroundColor: tag.color }}
                    onClick={() => handleBulkTagAdd(tag.id)}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="rounded-md border">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="documents">
            {(provided) => (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedDocuments.length === documents.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDocuments(documents.map(doc => doc.id));
                          } else {
                            setSelectedDocuments([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1"
                      >
                        Navn
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('file_type')}
                        className="flex items-center gap-1"
                      >
                        Type
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('created_at')}
                        className="flex items-center gap-1"
                      >
                        Dato
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {documents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Ingen dokumenter lastet opp ennå
                      </TableCell>
                    </TableRow>
                  ) : (
                    documents.map((doc, index) => (
                      <Draggable key={doc.id} draggableId={doc.id} index={index}>
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedDocuments.includes(doc.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedDocuments([...selectedDocuments, doc.id]);
                                  } else {
                                    setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                {doc.name}
                              </div>
                            </TableCell>
                            <TableCell>{doc.file_type}</TableCell>
                            <TableCell>
                              {new Date(doc.created_at).toLocaleDateString('no-NO')}
                            </TableCell>
                            <TableCell>
                              <DocumentTags
                                documentId={doc.id}
                                onTagsChange={fetchDocuments}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDownload(doc)}
                                  title="Last ned"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(doc)}
                                  title="Slett"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </TableBody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
