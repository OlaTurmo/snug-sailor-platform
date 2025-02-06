
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "./use-toast";

export const useSignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      toast({
        title: "Konto opprettet",
        description: "Du er nå registrert og logget inn.",
      });
      navigate("/oversikt");
    } catch (error: any) {
      console.error("Signup error:", error);
      
      if (error?.code === "user_already_exists") {
        toast({
          title: "E-postadressen er allerede i bruk",
          description: "Vennligst logg inn eller bruk en annen e-postadresse.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Feil ved registrering",
        description: "Kunne ikke opprette konto. Prøv igjen senere.",
        variant: "destructive",
      });
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    handleSubmit
  };
};
