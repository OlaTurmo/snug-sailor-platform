import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Liability, LiabilityType } from "@/types/finance";

interface AddLiabilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (liability: Liability) => void;
}

export const AddLiabilityDialog = ({ open, onOpenChange, onAdd }: AddLiabilityDialogProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<LiabilityType>("debt");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const liability: Liability = {
      id: crypto.randomUUID(),
      project_id: "default",
      name,
      type,
      amount: parseFloat(amount),
      due_date: dueDate,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    onAdd(liability);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setType("debt");
    setDescription("");
    setAmount("");
    setDueDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Legg til Gjeld</DialogTitle>
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
            <Select value={type} onValueChange={(value: LiabilityType) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debt">Gjeld</SelectItem>
                <SelectItem value="tax">Skatt</SelectItem>
                <SelectItem value="bill">Regning</SelectItem>
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
            <Label htmlFor="amount">Beløp (NOK)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Forfallsdato</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
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