
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
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
      
      // Handle specific error cases
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Logg inn på din konto
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Eller{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              opprett en ny konto
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@epost.no"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passord</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logger inn...
              </>
            ) : (
              "Logg inn"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
