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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
  role: z.enum(["viewer", "editor", "administrator"], {
    required_error: "Velg en rolle",
  }),
});

interface InviteUserDialogProps {
  estateId: string;
}

export function InviteUserDialog({ estateId }: InviteUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "viewer",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      console.error("No authenticated user found");
      toast({
        title: "Feil",
        description: "Du må være logget inn for å invitere brukere",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Starting invitation process...", { estateId, ...values, currentUser: user.id });
      
      // Check if estate exists and user has permission
      const { data: estate, error: estateError } = await supabase
        .from("estates")
        .select("id, user_id")
        .eq("id", estateId)
        .single();

      if (estateError) {
        console.error("Error checking estate:", estateError);
        throw new Error("Kunne ikke verifisere boet");
      }

      if (!estate) {
        console.error("Estate not found:", estateId);
        throw new Error("Boet ble ikke funnet");
      }

      // Check if user is estate owner or admin
      const { data: memberData, error: memberError } = await supabase
        .from("estate_members")
        .select("role")
        .eq("estate_id", estateId)
        .eq("user_id", user.id)
        .single();

      console.log("Member check result:", { memberData, memberError });

      const isOwner = estate.user_id === user.id;
      const isAdmin = memberData?.role === "administrator";

      if (!isOwner && !isAdmin) {
        console.error("User lacks permission:", { isOwner, isAdmin, userId: user.id });
        throw new Error("Du har ikke tillatelse til å invitere brukere til dette boet");
      }

      // Create invitation
      const { data: invitation, error: inviteError } = await supabase
        .from("estate_invitations")
        .insert({
          estate_id: estateId,
          email: values.email,
          role: values.role,
          invited_by: user.id,
        })
        .select()
        .single();

      if (inviteError) {
        console.error("Error creating invitation:", inviteError);
        throw new Error(inviteError.message);
      }

      console.log("Invitation created successfully:", invitation);
      
      toast({
        title: "Invitasjon sendt",
        description: `Invitasjon sendt til ${values.email}`,
      });
      
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error in invitation process:", error);
      toast({
        title: "Feil ved sending av invitasjon",
        description: error instanceof Error ? error.message : "Kunne ikke sende invitasjonen. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Inviter bruker
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inviter bruker til boet</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input placeholder="ola.nordmann@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rolle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Velg en rolle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="viewer">Leser</SelectItem>
                      <SelectItem value="editor">Redaktør</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sender invitasjon...
                </>
              ) : (
                "Send invitasjon"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}