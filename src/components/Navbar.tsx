import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-900">
              Speak<span className="text-purple-600">Space</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</Link>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">How It Works</a>
            <Link to="/resources" className="text-gray-700 hover:text-indigo-600 transition-colors">Resources</Link>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">Pricing</a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50" asChild>
              <Link to="/userlogin">Log In</Link>
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
              <Link to="/usersignup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 border-b border-gray-200">
          <nav className="flex flex-col space-y-4 mb-6">
            <Link to="/features" className="text-gray-700 hover:text-indigo-600 transition-colors py-2">Features</Link>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors py-2">How It Works</a>
            <Link to="/resources" className="text-gray-700 hover:text-indigo-600 transition-colors py-2">Resources</Link>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors py-2">Pricing</a>
          </nav>
          <div className="flex flex-col space-y-3">
            <Button variant="outline" className="border-indigo-600 text-indigo-600 w-full" asChild>
              <Link to="/userlogin">Log In</Link>
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 w-full" asChild>
              <Link to="/usersignup">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
