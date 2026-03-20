import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Microscope, Scroll, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", path: "/#about", icon: <Scroll className="w-4 h-4" /> },
    { name: "Departments", path: "/#departments", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Research", path: "/#research", icon: <Microscope className="w-4 h-4" /> },
    { name: "News", path: "/#news", icon: <Newspaper className="w-4 h-4" /> },
  ];

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (path.startsWith("/#")) {
      const id = path.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel shadow-md py-2"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-6 group">
            <img src={logo} alt="Asimov University Logo" className="w-24 h-24 object-contain" />
            <div className="flex flex-col">
              <span className={`font-display text-3xl tracking-widest uppercase ${isTransparent ? 'text-white' : 'text-black'}`}>Asimov</span>
              <span className={`font-serif text-base tracking-wider uppercase ${isTransparent ? 'text-white' : 'text-black'}`}>University</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`flex items-center space-x-2 font-serif text-lg tracking-wide transition-colors duration-200 hover:text-[var(--color-au-gold)] ${
                  isTransparent ? "text-white" : "text-[var(--color-au-blue-dark)]"
                }`}
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/apply"
              className="group relative inline-block px-6 py-2.5 bg-[var(--color-au-blue-dark)] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]"
            >
              <div className="absolute inset-0 border border-[var(--color-au-gold)] opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-au-gold)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-au-gold)]"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-au-gold)]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-au-gold)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-au-gold)]/60 to-transparent skew-x-12"
                animate={{ x: ["-150%", "150%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
              />
              
              <motion.div
                className="absolute inset-0 bg-[var(--color-au-blue)] opacity-0 group-hover:opacity-30"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <span className="relative z-10 font-display text-sm tracking-[0.2em] uppercase text-white group-hover:text-[var(--color-au-gold)] transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,1)]">
                Apply Now
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[var(--color-au-blue-dark)] hover:text-[var(--color-au-gold)] focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-panel absolute w-full border-t border-[var(--color-au-gold)]/20 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className="block px-3 py-3 rounded-md text-base font-serif text-[var(--color-au-blue-dark)] hover:bg-[var(--color-au-gold)]/10 hover:text-[var(--color-au-gold)]"
                >
                  <div className="flex items-center space-x-3">
                    {link.icon}
                    <span>{link.name}</span>
                  </div>
                </a>
              ))}
              <Link
                to="/apply"
                onClick={() => setIsOpen(false)}
                className="group relative inline-block w-full text-center mt-4 px-6 py-3 bg-[var(--color-au-blue-dark)] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]"
              >
                <div className="absolute inset-0 border border-[var(--color-au-gold)] opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-au-gold)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-au-gold)]"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-au-gold)]"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-au-gold)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-au-gold)]/60 to-transparent skew-x-12"
                  animate={{ x: ["-150%", "150%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                />
                
                <motion.div
                  className="absolute inset-0 bg-[var(--color-au-blue)] opacity-0 group-hover:opacity-30"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <span className="relative z-10 font-display text-sm tracking-[0.2em] uppercase text-white group-hover:text-[var(--color-au-gold)] transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,1)]">
                  Apply Now
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
