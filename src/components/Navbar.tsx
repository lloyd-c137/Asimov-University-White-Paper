import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Microscope, Scroll, Newspaper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/newlogo.png";

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: "About", path: "/#about", icon: <Scroll className="w-4 h-4" /> },
    { name: "Departments", path: "/departments", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Research", path: "/research", icon: <Microscope className="w-4 h-4" /> },
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
          : "bg-transparent py-4 md:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-28">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 md:space-x-6 group">
            <img src={logo} alt="Asimov University Logo" className="w-12 h-12 md:w-24 md:h-24 object-contain" />
            <div className="flex flex-col">
              <span className={`font-display text-lg md:text-3xl tracking-widest uppercase ${isTransparent ? 'text-white' : 'text-black'}`}>Asimov</span>
              <span className={`font-serif text-xs md:text-base tracking-wider uppercase ${isTransparent ? 'text-white' : 'text-black'}`}>University</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
            link.path.startsWith("/#") ? (
              <a
                key={link.name}
                href={link.path}
                className={`flex items-center space-x-2 font-serif text-lg tracking-wide transition-colors duration-200 hover:text-[var(--color-au-accent)] ${
                  isTransparent ? "text-white" : "text-[var(--color-au-blue-dark)]"
                }`}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-2 font-serif text-lg tracking-wide transition-colors duration-200 hover:text-[var(--color-au-accent)] ${
                  isTransparent ? "text-white" : "text-[var(--color-au-blue-dark)]"
                }`}
              >
                {link.name}
              </Link>
            )
          ))}
            <Link
              to="/apply"
              className="group relative inline-block px-6 py-2.5 bg-[var(--color-au-blue-dark)] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.6)]"
            >
              <div className="absolute inset-0 border border-[var(--color-au-accent)] opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--color-au-accent)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-au-accent)]"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-au-accent)]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--color-au-accent)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-au-accent)]/60 to-transparent skew-x-12"
                animate={{ x: ["-150%", "150%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
              />
              
              <motion.div
                className="absolute inset-0 bg-[var(--color-au-blue)] opacity-0 group-hover:opacity-30"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <span className="relative z-10 font-display text-sm tracking-[0.2em] uppercase text-white group-hover:text-[var(--color-au-accent)] transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,1)]">
                Apply Now
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg focus:outline-none transition-colors ${
                isTransparent && !scrolled 
                  ? "text-white hover:bg-white/10" 
                  : "text-[var(--color-au-blue-dark)] hover:bg-[var(--color-au-blue-dark)]/10"
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-[var(--color-au-blue-dark)] z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <span className="text-white font-display text-lg tracking-widest uppercase">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-4 space-y-1">
                {navLinks.map((link) => (
                  link.path.startsWith("/#") ? (
                    <a
                      key={link.name}
                      href={link.path}
                      onClick={() => handleNavClick(link.path)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-[var(--color-au-accent)] transition-colors font-serif text-lg"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-[var(--color-au-accent)] transition-colors font-serif text-lg"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  )
                ))}
                
                <div className="pt-4 border-t border-white/10 mt-4">
                  <Link
                    to="/apply"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full px-6 py-4 bg-[var(--color-au-accent)] text-[var(--color-au-blue-dark)] font-display text-sm tracking-[0.15em] uppercase rounded-lg hover:bg-[var(--color-au-cream)] transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
