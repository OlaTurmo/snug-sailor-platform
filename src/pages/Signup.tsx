import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
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
    } catch (error) {
      toast({
        title: "Feil ved registrering",
        description: "Kunne ikke opprette konto. Prøv igjen senere.",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Opprett ny konto
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Eller{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              logg inn på eksisterende konto
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Navn
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Navn"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                E-post
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-post"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Passord
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passord"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Opprett konto
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;