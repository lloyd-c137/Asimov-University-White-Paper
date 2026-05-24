import { motion } from "framer-motion";
import { 
  Shield, Users, Cpu, Scale, BookOpen, Globe, Zap
} from "lucide-react";

const humanSeats = [
  {
    title: "Foundation Representative",
    tag: "Permanent · Veto Power",
    description: "Guardian of the mission charter, ensuring all decisions align with the university's founding human-centric principles."
  },
  {
    title: "Educationalists",
    tag: "1 Seat",
    description: "World-class education innovators focusing on pedagogical evolution and global knowledge accessibility."
  },
  {
    title: "Industry Leaders",
    tag: "1 Seat",
    description: "Experts from technology, business, and social enterprise bridging the gap between academia and real-world impact."
  },
  {
    title: "Ethicist",
    tag: "1 Seat",
    description: "Philosophy and AI ethics specialist dedicated to the moral implications of advanced research and automated governance."
  },
  {
    title: "Student Representative",
    tag: "1 Seat · 1-Year Term",
    description: "The direct voice of the learner community, ensuring student interests are represented at the highest level."
  },
  {
    title: "Academic Advisor",
    tag: "1 Seat · 2-Year Term",
    description: "External academic counsel providing objective peer review of institutional standards and research integrity."
  }
];

const aiSeats = [
  {
    name: "Oracle",
    type: "Assessment System",
    domain: "Student performance · Institutional analytics",
    description: "A high-fidelity predictive model that provides real-time feedback on educational outcomes and resource allocation efficiency."
  },
  {
    name: "Athena",
    type: "President · Founding AI",
    domain: "Academic standards · Policy · Strategy",
    description: "The core intelligence responsible for long-term strategic pathfinding and maintaining the integrity of academic rigor."
  },
  {
    name: "Lyra",
    type: "Faculty Secretary",
    domain: "Admissions · Student support · Faculty coordination",
    description: "An orchestration layer that optimizes faculty-student interactions and ensures administrative transparency."
  }
];

const decisionFramework = [
  {
    id: "A",
    title: "Values & Ethics",
    voting: "⅔ human majority",
    description: "Human primacy in moral decisions, ensuring university values remain anchored in human experience."
  },
  {
    id: "B",
    title: "Academic Standards",
    voting: "Simple majority",
    description: "Equal partnership in education, where AI metrics and human expertise collaborate on curriculum quality."
  },
  {
    id: "C",
    title: "Operations & Technology",
    voting: "Majority + AI advisory",
    description: "Technical expertise meets governance, optimizing institutional infrastructure through data-driven insight."
  },
  {
    id: "D",
    title: "Emergency Decisions",
    voting: "Athena temporary authority",
    description: "Rapid response protocols where the AI can take immediate action, ratified by the Board within 48 hours."
  }
];

const principles = [
  { title: "Academic Independence", desc: "Protecting the pursuit of truth from political or commercial interference." },
  { title: "Long-term Stewardship", desc: "Decisions are weighed on a multi-generational horizon, not quarterly cycles." },
  { title: "Transparency and Accountability", desc: "Full auditability of both human votes and AI decision-logic streams." },
  { title: "Global Responsibility", desc: "Recognizing that our knowledge has a boundaryless impact on humanity." }
];

export default function Board() {
  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32">
      {/* 1. Hero Section */}
      <section className="min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center items-center text-center px-4 md:px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-[var(--color-au-blue-dark)] font-medium tracking-[0.2em] uppercase text-xs md:text-sm mb-6 md:mb-8"
        >
          Institutional Stewardship
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-display text-[var(--color-au-blue-dark)] mb-6 md:mb-8"
        >
          Board of <span className="italic text-[var(--color-au-accent)]">Governors</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-500 font-serif italic max-w-2xl mb-4 md:mb-6 px-2"
        >
          Guiding the long-term vision, integrity, and stewardship of Asimov University.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm md:text-base text-gray-400 max-w-xl px-2"
        >
          The Board brings together leaders from science, education, and industry to ensure the university serves humanity through knowledge.
        </motion.p>
      </section>

      {/* 2. Board Overview */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display text-[var(--color-au-blue-dark)] mb-8 md:mb-12">The Role of the Board</h2>
          <div className="space-y-6 md:space-y-8 text-base md:text-lg text-gray-600 leading-relaxed text-left font-serif">
            <p>
              The Asimov University Board of Governors serves as the ultimate authority for the institution's strategic direction and fiscal responsibility. Operating at the intersection of human wisdom and computational precision, the Board ensures that the University's mission remains uncompromised by short-term pressures.
            </p>
            <p>
              With a unique bicameral structure of Human and AI seats, the Board facilitates a governance model for the next century—balancing deep ethical stewardship with data-driven institutional agility. Every policy, from academic independence to global research ethics, is ratified through our integrated Decision Framework.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Human Seats */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-4 md:gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-display text-[var(--color-au-blue-dark)] mb-2">Human Seats</h2>
              <p className="text-sm md:text-base text-gray-500 font-serif">Diverse expertise. Human stewardship of the mission.</p>
            </div>
            <div className="bg-[var(--color-au-blue-dark)] text-white px-3 md:px-4 py-1.5 md:py-2 font-display text-[10px] md:text-xs font-bold uppercase tracking-widest">
              6 Seats · One-vote mission veto
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {humanSeats.map((seat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="p-6 md:p-8 border border-gray-100 transition-all duration-200 group hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <h3 className="text-lg md:text-xl font-display text-[var(--color-au-blue-dark)]">{seat.title}</h3>
                  <span className="font-display text-[10px] bg-gray-50 text-gray-400 border border-gray-100 px-2 py-1 uppercase tracking-tighter">
                    {seat.tag}
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed font-serif">{seat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI Seats */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-[#F9FAFB]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-4 md:gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-display text-[var(--color-au-blue-dark)] mb-2">Machine Perspective — AI Seats</h2>
              <p className="text-sm md:text-base text-gray-500 font-serif">Permanent data-driven insight embedded into governance.</p>
            </div>
            <div className="bg-[var(--color-au-blue-dark)]/10 text-[var(--color-au-blue-dark)] px-3 md:px-4 py-1.5 md:py-2 font-display text-[10px] md:text-xs font-bold uppercase tracking-widest border border-[var(--color-au-blue-dark)]/20">
              3 Permanent Seats
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {aiSeats.map((seat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 md:p-8 bg-white border border-gray-200 transition-all duration-200 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-20 md:w-24 h-20 md:h-24 bg-[var(--color-au-blue-dark)]/5 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Cpu className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-au-blue-dark)] mb-4 md:mb-6" />
                <h3 className="text-xl md:text-2xl font-display text-[var(--color-au-blue-dark)] mb-1">{seat.name}</h3>
                <p className="text-[var(--color-au-blue-dark)]/60 font-display text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">{seat.type}</p>

                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="font-display text-[10px] text-gray-400 uppercase font-bold mb-1">Inherent Domain</p>
                    <p className="font-serif font-medium text-[var(--color-au-blue-dark)] text-sm">{seat.domain}</p>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed font-serif">{seat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Decision Framework */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-display text-[var(--color-au-blue-dark)] mb-3 md:mb-4">Decision Framework</h2>
            <p className="text-sm md:text-base text-gray-500 font-serif max-w-xl mx-auto">A tiered voting system balancing human judgment and AI insight.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {decisionFramework.map((framework, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 md:p-10 border border-gray-100 flex flex-col items-center text-center transition-all hover:shadow-lg"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[var(--color-au-blue-dark)]/20 flex items-center justify-center text-[var(--color-au-blue-dark)] font-display text-lg md:text-xl mb-6 md:mb-8">
                  {framework.id}
                </div>
                <h3 className="text-lg md:text-xl font-display text-[var(--color-au-blue-dark)] mb-3 md:mb-4">{framework.title}</h3>
                <div className="px-2 md:px-3 py-1 bg-[var(--color-au-blue-dark)]/5 text-[var(--color-au-blue-dark)] font-display text-[10px] font-bold uppercase tracking-wider rounded-full mb-4 md:mb-6">
                  {framework.voting}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed font-serif">{framework.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Governance Principles */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display text-[var(--color-au-blue-dark)] mb-12 md:mb-16">Governance Principles</h2>
          <div className="space-y-8 md:space-y-12 text-left">
            {principles.map((principle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 md:gap-8 group"
              >
                <span className="text-[var(--color-au-blue-dark)]/20 font-display text-3xl md:text-5xl leading-none">{i + 1}</span>
                <div>
                  <h3 className="text-lg md:text-xl font-display text-[var(--color-au-blue-dark)] mb-1 md:mb-2">{principle.title}</h3>
                  <p className="text-sm md:text-base text-gray-500 font-serif">{principle.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Quote Block */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-2xl md:text-3xl lg:text-5xl font-display text-[var(--color-au-blue-dark)] leading-tight italic"
          >
            "The Board of Governors is not just a governance structure. It is a living laboratory for human-AI coexistence."
          </motion.p>
        </div>
      </section>
    </div>
  );
}
