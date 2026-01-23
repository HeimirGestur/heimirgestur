import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Selected", path: "/" },
  { name: "Films", path: "/films" },
  { name: "Music Videos", path: "/music-videos" },
  { name: "Commercials", path: "/commercials" },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <nav className="flex justify-center items-center py-4 px-6">
        <ul className="flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "nav-link font-sans text-sm",
                  location.pathname === item.path && "nav-link-active"
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};
