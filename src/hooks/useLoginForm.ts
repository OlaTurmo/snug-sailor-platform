
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "./use-toast";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== Login Flow Start ===');
    console.log('Form submitted with email:', email);
    setIsLoading(true);
    
    try {
      console.log('Calling login function...');
      const loginResult = await login(email, password);
      
      console.log('Login function completed successfully');
      console.log('Login result:', loginResult);
      
      if (loginResult?.user) {
        console.log('Login successful, user data received:', loginResult.user);
        
        toast({
          title: "Innlogget",
          description: "Du er nå logget inn.",
        });
        
        console.log('Attempting navigation to /oversikt');
        navigate("/oversikt");
        console.log('Navigation command executed');
      } else {
        console.log('No user data received after login');
        toast({
          title: "Feil ved innlogging",
          description: "Kunne ikke hente brukerprofil. Prøv igjen.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = "Vennligst sjekk brukernavn og passord.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Feil brukernavn eller passord.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "E-posten din er ikke bekreftet. Sjekk innboksen din.";
      }
      
      toast({
        title: "Feil ved innlogging",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.log('=== Login Flow End ===');
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSubmit
  };
};
