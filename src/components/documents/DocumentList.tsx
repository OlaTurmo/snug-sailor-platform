
import { useState } from "react";
import { TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TagManagement } from "./TagManagement";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DocumentTableHeader } from "./DocumentTableHeader";
import { DocumentRow } from "./DocumentRow";
import { useDocuments } from "./hooks/useDocuments";
import { Tag, DocumentItem } from "./types";

export const DocumentList = ({ onDocumentDeleted }: { onDocumentDeleted: () => void }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const { toast } = useToast();
  
  const {
    documents,
    setDocuments,
    isLoading,
    handleSort,
    fetchDocuments
  } = useDocuments(selectedTags);

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
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

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
                <DocumentTableHeader
                  onSort={handleSort}
                  selectedDocuments={selectedDocuments}
                  documents={documents}
                  onSelectAll={(checked) => {
                    if (checked) {
                      setSelectedDocuments(documents.map(doc => doc.id));
                    } else {
                      setSelectedDocuments([]);
                    }
                  }}
                />
                <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        Ingen dokumenter lastet opp ennå
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc, index) => (
                      <Draggable key={doc.id} draggableId={doc.id} index={index}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <DocumentRow
                              doc={doc}
                              isSelected={selectedDocuments.includes(doc.id)}
                              onSelect={(checked) => {
                                if (checked) {
                                  setSelectedDocuments([...selectedDocuments, doc.id]);
                                } else {
                                  setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                                }
                              }}
                              onDownload={handleDownload}
                              onDelete={handleDelete}
                              onTagsChange={fetchDocuments}
                            />
                          </tr>
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
