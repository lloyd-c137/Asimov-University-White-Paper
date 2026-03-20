import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Twitter, Linkedin, Github } from "lucide-react";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-au-blue-dark)] text-[var(--color-au-cream)] pt-16 pb-8 border-t-4 border-[var(--color-au-gold)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Identity & Motto */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="Asimov University Logo" className="w-16 h-16 object-contain" />
              <div className="flex flex-col">
                <span className="font-display text-2xl tracking-widest uppercase">Asimov</span>
                <span className="font-serif text-sm tracking-wider text-[var(--color-au-gold)] uppercase">University</span>
              </div>
            </div>
            <p className="font-body text-lg italic text-[var(--color-au-gold-light)]/80 mt-4 border-l-2 border-[var(--color-au-gold)] pl-4">
              "It is always human who asks."
            </p>
            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Cultivating the next generation of architects for human-machine symbiosis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-display text-lg uppercase tracking-wider text-[var(--color-au-gold)] mb-6">Academics</h3>
            <ul className="space-y-3 font-serif text-gray-300">
              <li><Link to="/departments" className="hover:text-[var(--color-au-gold)] transition-colors">Cognitive Computing</Link></li>
              <li><Link to="/departments" className="hover:text-[var(--color-au-gold)] transition-colors">Robotic Ethics</Link></li>
              <li><Link to="/departments" className="hover:text-[var(--color-au-gold)] transition-colors">Symbiotic Interface Design</Link></li>
              <li><Link to="/departments" className="hover:text-[var(--color-au-gold)] transition-colors">Algorithmic Philosophy</Link></li>
            </ul>
          </div>

          {/* Admissions */}
          <div className="col-span-1">
            <h3 className="font-display text-lg uppercase tracking-wider text-[var(--color-au-gold)] mb-6">Admissions</h3>
            <ul className="space-y-3 font-serif text-gray-300">
              <li><Link to="/apply" className="hover:text-[var(--color-au-gold)] transition-colors">Apply Now</Link></li>
              <li><Link to="/admissions" className="hover:text-[var(--color-au-gold)] transition-colors">Tuition & Financial Aid</Link></li>
              <li><Link to="/admissions" className="hover:text-[var(--color-au-gold)] transition-colors">Campus Life</Link></li>
              <li><Link to="/admissions" className="hover:text-[var(--color-au-gold)] transition-colors">Virtual Tour</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-display text-lg uppercase tracking-wider text-[var(--color-au-gold)] mb-6">Contact</h3>
            <div className="space-y-4 font-serif text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[var(--color-au-gold)] mt-1" />
                <span>1010 Positronic Way,<br />Neo-Florence, NF 42099</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[var(--color-au-gold)]" />
                <span>+1 (555) 3-LAWS-00</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[var(--color-au-gold)]" />
                <span>admissions@asimov.edu</span>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <a href="#" className="text-gray-400 hover:text-[var(--color-au-gold)] transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-[var(--color-au-gold)] transition-colors"><Linkedin size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-[var(--color-au-gold)] transition-colors"><Github size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center font-serif text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Asimov University. All rights reserved. Designed for the Future.</p>
        </div>
      </div>
    </footer>
  );
}
