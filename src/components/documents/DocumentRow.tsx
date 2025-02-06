
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download, Trash2 } from "lucide-react";
import { DocumentTags } from "./DocumentTags";
import { DocumentItem } from "./types";

interface DocumentRowProps {
  doc: DocumentItem;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onDownload: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
  onTagsChange: () => void;
}

export const DocumentRow = ({
  doc,
  isSelected,
  onSelect,
  onDownload,
  onDelete,
  onTagsChange,
}: DocumentRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(!!checked)}
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
          onTagsChange={onTagsChange}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload(doc)}
            title="Last ned"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(doc)}
            title="Slett"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
