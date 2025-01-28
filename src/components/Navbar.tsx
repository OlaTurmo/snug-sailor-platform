import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const ListItem = ({
    className,
    title,
    children,
    ...props
  }: {
    className?: string;
    title: string;
    children?: React.ReactNode;
    href: string;
  }) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  };

  return (
    <nav className="fixed top-0 w-full bg-white border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Arveoppgjør
          </Link>

          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Oversikt</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <ListItem href="/oversikt" title="Dashbord">
                          Hovedoversikt og varsler
                        </ListItem>
                        <ListItem href="/finance" title="Økonomi">
                          Økonomistyring og regnskap
                        </ListItem>
                        <ListItem href="/tasks" title="Oppgaver">
                          Oppgaveliste og fremdrift
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Dokumenter</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <ListItem href="/documents" title="Dokumenthåndtering">
                          Last opp og organiser dokumenter
                        </ListItem>
                        <ListItem href="/collaboration" title="Samarbeid">
                          Del og samarbeid med andre
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Økonomi</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <ListItem href="/finance" title="Økonomistyring">
                          Inntekter, utgifter og regnskap
                        </ListItem>
                        <ListItem href="/assets-liabilities" title="Eiendeler og Gjeld">
                          Oversikt over verdier og forpliktelser
                        </ListItem>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <Button onClick={() => signOut()} variant="outline">
                Logg ut
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Logg inn</Button>
              </Link>
              <Link to="/signup">
                <Button>Registrer</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md"
            >
              <span className="sr-only">Åpne hovedmeny</span>
              {/* Menu icon */}
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? "block" : "hidden"} md:hidden pb-4`}>
          {user ? (
            <div className="space-y-2">
              <Link
                to="/oversikt"
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
              >
                Oversikt
              </Link>
              <Link
                to="/finance"
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
              >
                Økonomi
              </Link>
              <Link
                to="/assets-liabilities"
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
              >
                Eiendeler og Gjeld
              </Link>
              <Link
                to="/documents"
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
              >
                Dokumenter
              </Link>
              <Link
                to="/tasks"
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
              >
                Oppgaver
              </Link>
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="w-full mt-4"
              >
                Logg ut
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
              >
                Logg inn
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
              >
                Registrer
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};