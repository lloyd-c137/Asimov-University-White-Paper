import { motion, LazyMotion, domAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";

const About = lazy(() => import("./About"));
const News = lazy(() => import("./News"));

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

function LoadingPlaceholder() {
  return (
    <div className="min-h-[400px] bg-[var(--color-au-cream)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--color-au-blue)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function Home() {
  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen bg-[var(--color-au-cream)]">
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] md:min-h-0 flex items-center justify-center overflow-hidden">
        {/* Abstract Background - Digital Renaissance */}
        <div className="absolute inset-0 bg-[var(--color-au-blue-dark)]">
          <div className="absolute inset-0 opacity-20" 
               style={{
                 backgroundImage: "radial-gradient(circle at 50% 50%, #2563eb 1px, transparent 1px)",
                 backgroundSize: "40px 40px"
               }}>
          </div>
          <motion.div 
            className="absolute w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-[var(--color-au-blue)] rounded-full blur-[100px] md:blur-[150px] opacity-40 -top-10 md:-top-20 -right-10 md:-right-20 will-change-transform"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.div 
            className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[var(--color-au-accent)] rounded-full blur-[120px] md:blur-[180px] opacity-20 -bottom-10 md:-bottom-20 -left-10 md:-left-20 will-change-transform"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          ></motion.div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-16 md:pt-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6 md:space-y-8"
          >
            <motion.p variants={fadeInUp} className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-serif text-gray-300 max-w-4xl mx-auto italic leading-tight px-2">
              "It is always human who asks."
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-6 md:pt-8 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 px-4">
              <Link to="/apply" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-[var(--color-au-accent)] text-white font-display uppercase tracking-widest text-sm md:text-base hover:bg-[var(--color-au-cream)] hover:text-[var(--color-au-blue-dark)] transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] text-center">
                Begin Your Journey
              </Link>
              <a href="#about" className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 border border-[var(--color-au-accent)] text-[var(--color-au-accent)] font-display uppercase tracking-widest text-sm md:text-base hover:bg-[var(--color-au-accent)] hover:text-white transition-all duration-300 text-center">
                Explore Our Philosophy
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-24 px-4 bg-[var(--color-au-cream)] relative">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12"
        >
          <motion.div variants={fadeInUp} className="w-12 h-12 md:w-16 md:h-16 mx-auto border-2 border-[var(--color-au-blue-dark)] rotate-45 flex items-center justify-center">
            <div className="w-8 h-8 md:w-10 md:h-10 border border-[var(--color-au-blue-dark)] -rotate-45"></div>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display text-[var(--color-au-blue-dark)] leading-tight">
            The Third <span className="italic">Intelligence</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl font-serif text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Human civilization has lived through two intelligence revolutions: Language and Writing. Now the third is here.
          </motion.p>
          <motion.div variants={fadeInUp} className="pt-6 md:pt-8 relative">
            <motion.p 
              className="text-2xl sm:text-3xl md:text-4xl font-display text-[var(--color-au-accent)] relative z-10 inline-block will-change-auto"
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

      <Suspense fallback={<LoadingPlaceholder />}>
        <About />
      </Suspense>

      {/* The CI Core */}
      <section className="px-4 mb-12 md:mb-24 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[var(--color-au-blue-dark)] text-white p-6 md:p-10 lg:p-16 rounded-sm relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-[var(--color-au-accent)] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display mb-4 md:mb-8 border-b border-[var(--color-au-accent)] pb-3 md:pb-4 inline-block">
                The CI Core
              </h2>
              <p className="font-serif text-base md:text-lg text-gray-300 mb-6 md:mb-10 max-w-3xl">
                Required of all students. This is the "operating system" of Collaborative Intelligence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                  { code: "CI-101", title: "Human-AI Collaboration", q: "How many kinds of relationships can exist?" },
                  { code: "CI-102", title: "The Human Mind", q: "How do you think?" },
                  { code: "CI-103", title: "The Machine Mind", q: "How does your AI partner think?" },
                  { code: "CI-104", title: "Collaboration in Practice", q: "How does 1+1 become 10?" },
                  { code: "CI-105", title: "Ethics and the Future", q: "What kind of world are we creating?" },
                ].map((course) => (
                  <div key={course.code} className="bg-white/5 p-4 md:p-6 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="text-[var(--color-au-accent)] font-display text-xs md:text-sm tracking-widest mb-1 md:mb-2">{course.code}</div>
                    <h3 className="text-lg md:text-xl font-serif mb-2 md:mb-3">{course.title}</h3>
                    <p className="text-xs md:text-sm text-gray-400 italic">"{course.q}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingPlaceholder />}>
        <News />
      </Suspense>

      {/* Quote Parallax-ish */}
      <section className="py-20 md:py-32 px-4 bg-[var(--color-au-blue-dark)] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
           <span className="text-[20vw] font-display text-[var(--color-au-accent)] leading-none select-none">ASIMOV</span>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-serif text-[var(--color-au-cream)] leading-snug px-2">
            "The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom."
          </h2>
          <p className="mt-6 md:mt-8 text-[var(--color-au-accent)] font-display tracking-widest uppercase text-sm md:text-base">— Isaac Asimov</p>
        </div>
      </section>

    </div>
    </LazyMotion>
  );
}
