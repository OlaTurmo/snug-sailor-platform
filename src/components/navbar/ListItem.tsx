
import { Link } from "react-router-dom";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface ListItemProps {
  className?: string;
  title: string;
  to: string;
}

export const ListItem = ({ className, title, to, ...props }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          className={cn(
            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
