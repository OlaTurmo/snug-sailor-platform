
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Asset, AssetType } from "@/types/finance";

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (asset: Omit<Asset, 'id' | 'estate_project_id'>) => void;
}

export const AddAssetDialog = ({ open, onOpenChange, onAdd }: AddAssetDialogProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<AssetType>("property");
  const [description, setDescription] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = {
      name,
      type,
      description,
      estimated_value: parseFloat(estimatedValue),
      valuation_date: new Date().toISOString(),
      status: "active" as const,
      created_at: new Date().toISOString(),
    };
    onAdd(asset);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setType("property");
    setDescription("");
    setEstimatedValue("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Legg til Eiendel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Navn</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: AssetType) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="property">Eiendom</SelectItem>
                <SelectItem value="vehicle">Kjøretøy</SelectItem>
                <SelectItem value="bank_account">Bankkonto</SelectItem>
                <SelectItem value="stock">Aksjer</SelectItem>
                <SelectItem value="valuable">Verdisaker</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Beskrivelse</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="estimatedValue">Estimert Verdi (NOK)</Label>
            <Input
              id="estimatedValue"
              type="number"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Legg til</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
