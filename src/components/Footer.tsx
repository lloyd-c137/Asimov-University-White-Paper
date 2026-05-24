import { Link } from "react-router-dom";
import { Mail, Twitter, Linkedin, Github } from "lucide-react";
import logo from "../assets/newlogo.png";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-au-blue-dark)] text-[var(--color-au-cream)] pt-10 md:pt-16 pb-6 md:pb-8 border-t-4 border-[var(--color-au-accent)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Identity & Motto */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 space-y-3 md:space-y-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <img src={logo} alt="Asimov University Logo" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
              <div className="flex flex-col">
                <span className="font-display text-xl md:text-2xl tracking-widest uppercase">Asimov</span>
                <span className="font-serif text-xs md:text-sm tracking-wider text-[var(--color-au-accent)] uppercase">University</span>
              </div>
            </div>
            <p className="font-body text-base md:text-lg italic text-[var(--color-au-accent-light)]/80 mt-3 md:mt-4 border-l-2 border-[var(--color-au-accent)] pl-3 md:pl-4">
              "It is always human who asks."
            </p>
          </div>
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-display text-base md:text-lg uppercase tracking-wider text-[var(--color-au-accent)] mb-4 md:mb-6">Academics</h3>
            <ul className="space-y-2 md:space-y-3 font-serif text-sm md:text-base text-gray-300">
              <li><Link to="/departments" className="hover:text-[var(--color-au-accent)] transition-colors">Cognitive Computing</Link></li>
              <li><Link to="/departments" className="hover:text-[var(--color-au-accent)] transition-colors">Robotic Ethics</Link></li>
              <li><Link to="/departments" className="hover:text-[var(--color-au-accent)] transition-colors">Symbiotic Interface Design</Link></li>
              <li><Link to="/departments" className="hover:text-[var(--color-au-accent)] transition-colors">Algorithmic Philosophy</Link></li>
            </ul>
          </div>

          {/* Admissions */}
          <div className="col-span-1">
            <h3 className="font-display text-base md:text-lg uppercase tracking-wider text-[var(--color-au-accent)] mb-4 md:mb-6">Admissions</h3>
            <ul className="space-y-2 md:space-y-3 font-serif text-sm md:text-base text-gray-300">
              <li><Link to="/apply" className="hover:text-[var(--color-au-accent)] transition-colors">Apply Now</Link></li>
              <li><Link to="/admissions" className="hover:text-[var(--color-au-accent)] transition-colors">Tuition & Financial Aid</Link></li>
              <li><Link to="/admissions" className="hover:text-[var(--color-au-accent)] transition-colors">Campus Life</Link></li>
              <li><Link to="/board" className="hover:text-[var(--color-au-accent)] transition-colors">Board of Governors</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-display text-base md:text-lg uppercase tracking-wider text-[var(--color-au-accent)] mb-4 md:mb-6">Contact</h3>
            <div className="space-y-3 md:space-y-4 font-serif text-sm md:text-base text-gray-300">

              <div className="flex items-center space-x-2 md:space-x-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-au-accent)] shrink-0" />
                <span>foundation@asimovuniversity.org</span>
              </div>
              
              <div className="flex space-x-3 md:space-x-4 pt-3 md:pt-4">
                <a href="#" className="text-gray-400 hover:text-[var(--color-au-accent)] transition-colors"><Twitter size={18} className="md:w-5 md:h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-[var(--color-au-accent)] transition-colors"><Linkedin size={18} className="md:w-5 md:h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-[var(--color-au-accent)] transition-colors"><Github size={18} className="md:w-5 md:h-5" /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center font-serif text-xs md:text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Asimov University. All rights reserved. Designed for the Future.</p>
        </div>
      </div>
    </footer>
  );
}
