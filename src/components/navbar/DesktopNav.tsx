
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { User } from "@/types/user";

interface DesktopNavProps {
  user: User | null;
  logout: () => Promise<void>;
}

export const DesktopNav = ({ user, logout }: DesktopNavProps) => {
  if (!user) {
    return (
      <div className="hidden sm:ml-6 sm:flex sm:items-center">
        <Link to="/login">
          <Button variant="outline">Logg inn</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              to="/oversikt"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Arbeidsflyt
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/document-management"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Dokumenter
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/task-management"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Oppgaver
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/assets-liabilities"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Eiendeler og Gjeld
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/boregnskap"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-accent hover:text-accent-foreground rounded-md"
            >
              Boregnskap
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Button onClick={() => logout()} variant="outline" className="ml-4">
        Logg ut
      </Button>
    </div>
  );
};
