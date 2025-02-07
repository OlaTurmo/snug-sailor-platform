
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Navn på bo er påkrevd"),
  deceased_name: z.string().min(1, "Navn på avdød er påkrevd"),
  deceased_date: z.string().min(1, "Dødsdato er påkrevd"),
  deceased_id_number: z
    .string()
    .min(11, "Fødselsnummer må være 11 siffer")
    .max(11, "Fødselsnummer må være 11 siffer")
    .regex(/^\d+$/, "Fødselsnummer må kun inneholde tall"),
});

interface AddEstateDialogProps {
  onEstateCreated?: () => void;
}

export function AddEstateDialog({ onEstateCreated }: AddEstateDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      deceased_name: "",
      deceased_date: "",
      deceased_id_number: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user?.id) {
        throw new Error('User must be logged in to create an estate');
      }

      console.log("Creating new estate with values:", { ...values, user_id: user.id });
      const { error } = await supabase.from("estates").insert({
        name: values.name,
        deceased_name: values.deceased_name,
        deceased_date: values.deceased_date,
        deceased_id_number: values.deceased_id_number,
        user_id: user.id,  // Explicitly set the user_id
      });

      if (error) {
        console.error("Error creating estate:", error);
        throw error;
      }

      console.log("Estate created successfully");
      toast({
        title: "Bo opprettet",
        description: "Boet ble opprettet successfully.",
      });
      
      setOpen(false);
      form.reset();
      if (onEstateCreated) {
        onEstateCreated();
      }
    } catch (error) {
      console.error("Error creating estate:", error);
      toast({
        title: "Feil ved opprettelse av bo",
        description: "Kunne ikke opprette boet. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nytt bo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Opprett nytt bo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn på bo</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv navn på bo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deceased_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Navn på avdød</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv navn på avdød" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deceased_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dødsdato</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deceased_id_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fødselsnummer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="11 siffer"
                      maxLength={11}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Oppretter...
                </>
              ) : (
                "Opprett bo"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
