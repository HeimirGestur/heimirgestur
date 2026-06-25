import { Link } from "react-router-dom";

interface FooterProps {
  name?: string;
}

export const Footer = ({ name = "Your Name" }: FooterProps) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-transparent hidden lg:block">
      <div className="flex justify-between items-center py-4 px-6">
        <div className="flex items-center gap-4">
          <span className="font-sans text-xs font-medium text-foreground">
            {name}
          </span>
          <Link
            to="/contact"
            className="nav-link font-sans text-xs"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};
