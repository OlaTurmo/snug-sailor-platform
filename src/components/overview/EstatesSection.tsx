
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddEstateDialog } from "@/components/estates/AddEstateDialog";
import { InviteUserDialog } from "@/components/estates/InviteUserDialog";

interface Estate {
  id: string;
  name: string;
  deceased_name: string;
  deceased_date: string;
  deceased_id_number: string;
  created_at: string;
}

interface EstatesSectionProps {
  estates: Estate[];
  onEstateCreated: () => void;
}

export const EstatesSection = ({ estates, onEstateCreated }: EstatesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktive bo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn på bo</TableHead>
                <TableHead>Avdød</TableHead>
                <TableHead>Dødsdato</TableHead>
                <TableHead>Fødselsnummer</TableHead>
                <TableHead>Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estates.map((estate) => (
                <TableRow key={estate.id}>
                  <TableCell>{estate.name}</TableCell>
                  <TableCell>{estate.deceased_name}</TableCell>
                  <TableCell>
                    {new Date(estate.deceased_date).toLocaleDateString('no-NO')}
                  </TableCell>
                  <TableCell>{estate.deceased_id_number}</TableCell>
                  <TableCell>
                    <InviteUserDialog estateId={estate.id} />
                  </TableCell>
                </TableRow>
              ))}
              {estates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Ingen aktive bo
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
