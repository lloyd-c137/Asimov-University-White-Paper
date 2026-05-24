import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink, ChevronDown, ChevronUp, Users, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
};

const RESEARCH_DATA = {
  publications: [
    {
      id: "pub-01",
      year: "2024",
      title: "The Fractal Architecture of LLM Reasoning Chains",
      journal: "Asimov Journal of Intelligence",
      authors: "Dr. Alistair Chen, Dr. Sarah Vo",
      link: "#",
      abstract: "This paper explores the recursive nature of chain-of-thought prompting in large language models. We demonstrate that the emergent logic in synthetic reasoning often follows a fractal pattern, where sub-tasks mirror the structure of the primary objective, leading to non-linear improvements in problem-solving accuracy.",
      findings: [
        "Identified self-similarity in reasoning hierarchies across 12 model architectures.",
        "Proposed a 'Recursive Precision' benchmark for measuring logical depth.",
        "Observed significant performance gains in multi-modal synthesis tasks."
      ]
    },
    {
      id: "pub-02",
      year: "2023",
      title: "Neuro-Pedagogical Alignment in Variable Contexts",
      journal: "International Learning Review",
      authors: "Prof. Robert Asimov, Kevin Wang",
      link: "#",
      abstract: "A study on the synchronization between neurological activity and digital pedagogical delivery. We investigate how varying the tempo of information presentation impacts long-term retention and cognitive fatigue in diverse learning environments.",
      findings: [
        "Real-time EEG feedback can reduce cognitive overload by 34% through adaptive pacing.",
        "Correlation established between 'flow state' markers and information entropy.",
        "Variable context training improves skill transferability compared to static methods."
      ]
    },
    {
      id: "pub-03",
      year: "2023",
      title: "Lower Bounds for Sparse Boolean Network Optimization",
      journal: "Theoretical Computer Science",
      authors: "Liam Taylor, Maria Garcia",
      link: "#",
      abstract: "We address the computational complexity of optimizing sparse boolean networks, particularly those utilized in neuromorphic computing. This research provides new lower bounds for approximation algorithms and discusses implications for P vs NP.",
      findings: [
        "Defined new complexity class boundaries for sparse relational networks.",
        "Proven theoretical limits for energy-efficient boolean gate arrangements.",
        "Developed a novel approximation algorithm for non-deterministic sparse structures."
      ]
    }
  ]
};

export default function Research() {
  const [expandedPub, setExpandedPub] = useState<string | null>(null);

  const filteredPublications = useMemo(() => {
    return RESEARCH_DATA.publications;
  }, []);

  const togglePublication = (id: string) => {
    setExpandedPub(expandedPub === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-32">
      {/* 1. Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center px-4 md:px-6 bg-white relative overflow-hidden">
        <div className="max-w-[840px] text-center z-10 py-16 md:py-20">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-display text-[var(--color-au-blue-dark)] leading-tight"
          >
            We study <span className="italic text-[var(--color-au-blue-dark)]">how</span> humans study
          </motion.h1>
        </div>
        <div className="absolute top-[20%] right-[-10%] w-72 md:w-96 h-72 md:h-96 bg-[var(--color-au-blue-dark)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-48 md:w-64 h-48 md:h-64 bg-[var(--color-au-blue-dark)]/5 rounded-full blur-3xl"></div>
      </section>

      {/* 2. Research Philosophy */}
      <section className="bg-white py-20 md:py-28 px-4 md:px-6">
        <div className="max-w-[720px] mx-auto">
          <motion.h2 
            {...fadeIn}
            className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-au-blue-dark)]/50 mb-6 md:mb-8"
          >
            Vision & Philosophy
          </motion.h2>
          <motion.div 
            {...fadeIn}
            className="space-y-8 text-xl md:text-2xl lg:text-3xl text-gray-800 font-serif leading-relaxed"
          >
            <p>
              At Asimov, we believe that the ultimate potential of the individual is restricted not by biological limits, but by outdated methodologies of acquisition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Publications */}
      <section className="bg-white py-20 md:py-28 px-4 md:px-6 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            {...fadeIn}
            className="text-3xl md:text-4xl lg:text-5xl font-display text-[var(--color-au-blue-dark)] text-center mb-16 md:mb-24"
          >
            Publications
          </motion.h2>
          <div className="space-y-4 md:space-y-6">
            {filteredPublications.map((pub) => (
              <motion.div 
                key={pub.id}
                {...fadeIn}
                className="group border-b border-gray-200 last:border-0"
              >
                <div 
                  onClick={() => togglePublication(pub.id)}
                  className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6 py-8 md:py-12 cursor-pointer transition-colors hover:bg-[var(--color-au-blue-dark)]/[0.02] px-4 -mx-4"
                >
                  <div className="space-y-3 md:space-y-4 flex-1">
                    <div className="font-display text-xs text-gray-400 tracking-widest uppercase flex items-center gap-4">
                      <span className="text-[var(--color-au-blue-dark)] font-bold">{pub.year}</span>
                      {expandedPub === pub.id ? <ChevronUp className="w-3 h-3 text-[var(--color-au-blue-dark)]" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-[var(--color-au-blue-dark)] group-hover:text-[var(--color-au-blue-dark)] transition-colors">
                      {pub.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500">{pub.authors} — <span className="italic">{pub.journal}</span></p>
                  </div>
                  <a 
                    href={pub.link}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 md:p-3 border border-gray-200 hover:bg-[var(--color-au-blue-dark)] hover:text-white transition-all self-start hidden md:flex"
                  >
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                  </a>
                </div>
                
                <AnimatePresence>
                  {expandedPub === pub.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 md:pb-12 px-4 space-y-6 md:space-y-8">
                        <div>
                          <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-[var(--color-au-blue-dark)]/40 mb-3 md:mb-4">Abstract</h4>
                          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl">
                            {pub.abstract}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-display text-[10px] font-bold uppercase tracking-widest text-[var(--color-au-blue-dark)]/40 mb-3 md:mb-4">Key Findings</h4>
                          <ul className="space-y-2 md:space-y-3">
                            {pub.findings.map((finding, idx) => (
                              <li key={idx} className="flex gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
                                <span className="text-[var(--color-au-blue-dark)] font-bold font-display tracking-tighter shrink-0">0{idx + 1}.</span>
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="md:hidden pt-2 md:pt-4">
                           <a 
                            href={pub.link}
                            className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-[var(--color-au-blue-dark)] text-white font-display text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-au-blue-dark)] transition-colors"
                          >
                            Full Report <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Research */}
      <section className="px-4 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 lg:p-16 bg-gradient-to-br from-[var(--color-au-blue-dark)]/10 to-transparent border border-[var(--color-au-blue-dark)] shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-[var(--color-au-blue-dark)]"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-[var(--color-au-blue-dark)]"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3 text-[var(--color-au-blue-dark)] mb-3 md:mb-4">
                  <Users className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="font-display tracking-widest uppercase text-xs md:text-sm">Join the Research</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-display text-[var(--color-au-blue-dark)] mb-3 md:mb-4">
                  Be part of something <span className="italic">unprecedented</span>.
                </h3>
                <p className="font-serif text-sm md:text-base text-gray-600 leading-relaxed">
                  Asimov University is building the research foundation for the next era of intelligence. 
                  We are looking for collaborators who share our conviction that the future of AI 
                  is not just about better models — it is about fundamentally rethinking what intelligence is.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  to="/apply"
                  className="group relative inline-block px-8 md:px-12 py-4 md:py-5 bg-[var(--color-au-blue-dark)] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,31,63,0.4)]"
                >
                  <div className="absolute inset-0 border border-[var(--color-au-accent)] opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-[var(--color-au-accent)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-[var(--color-au-accent)]"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-[var(--color-au-accent)]"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-[var(--color-au-accent)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                  
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
                  
                  <span className="relative z-10 font-display text-base md:text-xl tracking-[0.2em] md:tracking-[0.3em] uppercase text-white group-hover:text-[var(--color-au-accent)] transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]">
                    JOIN
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
