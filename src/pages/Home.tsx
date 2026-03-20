import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import About from "./About";
import Departments from "./Departments";
import Research from "./Research";
import News from "./News";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-au-cream)]">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Background - Digital Renaissance */}
        <div className="absolute inset-0 bg-[var(--color-au-blue-dark)]">
          <div className="absolute inset-0 opacity-20" 
               style={{
                 backgroundImage: "radial-gradient(circle at 50% 50%, #2563eb 1px, transparent 1px)",
                 backgroundSize: "40px 40px"
               }}>
          </div>
          <motion.div 
            className="absolute w-[800px] h-[800px] bg-[var(--color-au-blue)] rounded-full blur-[150px] opacity-40 -top-20 -right-20"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div 
            className="absolute w-[600px] h-[600px] bg-[var(--color-au-gold)] rounded-full blur-[180px] opacity-20 -bottom-20 -left-20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          ></motion.div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.p variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-300 max-w-4xl mx-auto italic leading-tight">
              "It is always human who asks."
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link to="/apply" className="px-8 py-4 bg-[var(--color-au-gold)] text-white font-display uppercase tracking-widest hover:bg-[var(--color-au-cream)] hover:text-[var(--color-au-blue-dark)] transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                Begin Your Journey
              </Link>
              <a href="#about" className="px-8 py-4 border border-[var(--color-au-gold)] text-[var(--color-au-gold)] font-display uppercase tracking-widest hover:bg-[var(--color-au-gold)] hover:text-white transition-all duration-300">
                Explore Our Philosophy
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 px-4 bg-[var(--color-au-cream)] relative">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center space-y-12"
        >
          <motion.div variants={fadeInUp} className="w-16 h-16 mx-auto border-2 border-[var(--color-au-blue-dark)] rotate-45 flex items-center justify-center">
            <div className="w-10 h-10 border border-[var(--color-au-blue-dark)] -rotate-45"></div>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-display text-[var(--color-au-blue-dark)]">
            The Third <span className="italic">Intelligence</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl font-serif text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Human civilization has lived through two intelligence revolutions: Language and Writing. Now the third is here.
          </motion.p>
          <motion.div variants={fadeInUp} className="pt-8 relative">
            <motion.p 
              className="text-3xl md:text-4xl font-display text-[var(--color-au-gold)] relative z-10 inline-block"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(37,99,235,0.5), 0 0 40px rgba(37,99,235,0.3), 0 0 60px rgba(37,99,235,0.2)",
                  "0 0 30px rgba(37,99,235,0.8), 0 0 60px rgba(37,99,235,0.5), 0 0 90px rgba(37,99,235,0.3)",
                  "0 0 20px rgba(37,99,235,0.5), 0 0 40px rgba(37,99,235,0.3), 0 0 60px rgba(37,99,235,0.2)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Collaborative Intelligence.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      <About />
      <Departments />
      <Research />
      <News />

      {/* Quote Parallax-ish */}
      <section className="py-32 px-4 bg-[var(--color-au-blue-dark)] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
           <span className="text-[20vw] font-display text-[var(--color-au-gold)] leading-none select-none">ASIMOV</span>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-au-cream)] leading-snug">
            "The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom."
          </h2>
          <p className="mt-8 text-[var(--color-au-gold)] font-display tracking-widest uppercase">— Isaac Asimov</p>
        </div>
      </section>

    </div>
  );
}
