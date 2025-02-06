
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SortField, SortOrder } from "./types";

interface DocumentTableHeaderProps {
  onSort: (field: SortField) => void;
  selectedDocuments: string[];
  documents: { id: string }[];
  onSelectAll: (checked: boolean) => void;
}

export const DocumentTableHeader = ({
  onSort,
  selectedDocuments,
  documents,
  onSelectAll,
}: DocumentTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox
            checked={selectedDocuments.length === documents.length}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
          />
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort('name')}
            className="flex items-center gap-1"
          >
            Navn
            <ChevronDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort('file_type')}
            className="flex items-center gap-1"
          >
            Type
            <ChevronDown className="h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort('created_at')}
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
  );
};
