
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  logout: () => Promise<void>;
}

export const MobileMenu = ({ isOpen, user, logout }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1">
        {user ? (
          <>
            <Link
              to="/oversikt"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Oversikt
            </Link>
            <Link
              to="/document-management"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dokumenter
            </Link>
            <Link
              to="/task-management"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Oppgaver
            </Link>
            <Link
              to="/assets-liabilities"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Eiendeler og Gjeld
            </Link>
            <Link
              to="/boregnskap"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Boregnskap
            </Link>
            <Button onClick={() => logout()} variant="outline" className="w-full mt-4">
              Logg ut
            </Button>
          </>
        ) : (
          <Link
            to="/login"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            Logg inn
          </Link>
        )}
      </div>
    </div>
  );
};
