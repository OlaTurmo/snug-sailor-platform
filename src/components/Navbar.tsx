import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Info,
  Users,
  Globe,
  FileText,
  Menu,
  HelpCircle,
  Phone,
  CreditCard,
  LogOut,
  ClipboardList,
  FileStack,
  PiggyBank,
  Users2,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Utlogget",
        description: "Du er nå logget ut.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Feil ved utlogging",
        description: "Kunne ikke logge ut.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] bg-clip-text text-transparent">
          Arv.ing
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-8 items-center">
          <Link 
            to="/" 
            className={`text-gray-600 hover:text-gray-900 flex items-center gap-2 ${isActive("/") ? "text-gray-900 font-medium" : ""}`}
          >
            <Home size={18} />
            Hjem
          </Link>

          {!user ? (
            <>
              <Link 
                to="/how-it-works" 
                className={`text-gray-600 hover:text-gray-900 flex items-center gap-2 ${isActive("/how-it-works") ? "text-gray-900 font-medium" : ""}`}
              >
                <Info size={18} />
                Slik fungerer det
              </Link>
              <Link 
                to="/pricing" 
                className={`text-gray-600 hover:text-gray-900 flex items-center gap-2 ${isActive("/pricing") ? "text-gray-900 font-medium" : ""}`}
              >
                <CreditCard size={18} />
                Priser
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/oversikt" 
                className={`text-gray-600 hover:text-gray-900 flex items-center gap-2 ${isActive("/oversikt") ? "text-gray-900 font-medium" : ""}`}
              >
                <ClipboardList size={18} />
                Oversikt
              </Link>
              <Link 
                to="/tasks" 
                className={`text-gray-600 hover:text-gray-900 flex items-center gap-2 ${isActive("/tasks") ? "text-gray-900 font-medium" : ""}`}
              >
                <FileStack size={18} />
                Oppgaver
              </Link>
              <Link 
                to="/finance" 
                className={`text-gray-600 hover:text-gray-900 flex items-center gap-2 ${isActive("/finance") ? "text-gray-900 font-medium" : ""}`}
              >
                <PiggyBank size={18} />
                Økonomi
              </Link>
              <Link 
                to="/collaboration" 
                className={`text-gray-600 hover:text-gray-900 flex items-center gap-2 ${isActive("/collaboration") ? "text-gray-900 font-medium" : ""}`}
              >
                <Users2 size={18} />
                Samarbeid
              </Link>
            </>
          )}

          <Link 
            to="/contact" 
            className={`text-gray-600 hover:text-gray-900 flex items-center gap-2 ${isActive("/contact") ? "text-gray-900 font-medium" : ""}`}
          >
            <Phone size={18} />
            Kontakt oss
          </Link>
          
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Globe size={18} />
                Språk
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Norsk</DropdownMenuItem>
              <DropdownMenuItem>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Login/Logout Button */}
          {user ? (
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Logg ut
            </Button>
          ) : (
            <Button 
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] hover:opacity-90 flex items-center gap-2"
            >
              <Users size={18} />
              Logg inn
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-center gap-2 w-full">
                  <Home size={18} />
                  Hjem
                </Link>
              </DropdownMenuItem>

              {!user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/how-it-works" className="flex items-center gap-2 w-full">
                      <Info size={18} />
                      Slik fungerer det
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pricing" className="flex items-center gap-2 w-full">
                      <CreditCard size={18} />
                      Priser
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/oversikt" className="flex items-center gap-2 w-full">
                      <ClipboardList size={18} />
                      Oversikt
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tasks" className="flex items-center gap-2 w-full">
                      <FileStack size={18} />
                      Oppgaver
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/finance" className="flex items-center gap-2 w-full">
                      <PiggyBank size={18} />
                      Økonomi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/collaboration" className="flex items-center gap-2 w-full">
                      <Users2 size={18} />
                      Samarbeid
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem asChild>
                <Link to="/contact" className="flex items-center gap-2 w-full">
                  <Phone size={18} />
                  Kontakt oss
                </Link>
              </DropdownMenuItem>

              {user ? (
                <DropdownMenuItem onClick={handleLogout}>
                  <div className="flex items-center gap-2 w-full">
                    <LogOut size={18} />
                    Logg ut
                  </div>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Button 
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-[#4A90E2] to-[#2C3E50] hover:opacity-90 flex items-center gap-2"
                  >
                    <Users size={18} />
                    Logg inn
                  </Button>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};