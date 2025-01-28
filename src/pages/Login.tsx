import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== Login Flow Start ===');
    console.log('Form submitted with email:', email);
    setIsLoading(true);
    
    try {
      console.log('Calling login function...');
      await login(email, password);
      
      console.log('Login function completed, waiting for user state update');
      // Add a longer delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Delay completed, current user state:', user);
      
      if (user) {
        console.log('User state is valid:', {
          id: user.id,
          email: user.email,
          role: user.role
        });
        
        console.log('Showing success toast notification');
        toast({
          title: "Innlogget",
          description: "Du er nå logget inn.",
        });
        
        console.log('Attempting navigation to /oversikt');
        navigate("/oversikt", { replace: true });
        console.log('Navigation command executed');
      } else {
        console.log('User state is null after login and delay');
        toast({
          title: "Feil ved innlogging",
          description: "Kunne ikke hente brukerprofil. Prøv igjen.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Feil ved innlogging",
        description: "Vennligst sjekk brukernavn og passord.",
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