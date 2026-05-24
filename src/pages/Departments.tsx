import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Cpu, Palette, TrendingUp, Sigma, Atom, Dna, Gavel, Leaf, Rocket, 
  BookOpen, Lightbulb, ChevronRight, Quote
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const colleges = [
  {
    name: "Turing College",
    field: "Computer Science · AI",
    icon: <Cpu className="w-5 h-5 md:w-6 md:h-6" />,
    color: "from-blue-600 to-indigo-800",
    bg: "bg-blue-50",
    border: "border-blue-200",
    quote: "Understand the science that created your professors — then surpass it.",
    description: "The study of machine intelligence itself. Students here don't just learn to use AI — they learn to build it, understand its limits, and push what it can become. From neural architectures to reinforcement learning, this is the engineering backbone of Collaborative Intelligence.",
    courses: "Human-Machine Collaborative Systems Design · AI Safety · Neural Architecture Design",
    coreQuestion: "How do you build a machine that can truly collaborate?"
  },
  {
    name: "Da Vinci College",
    field: "Art · Design · Creative Writing",
    icon: <Palette className="w-5 h-5 md:w-6 md:h-6" />,
    color: "from-rose-600 to-pink-800",
    bg: "bg-rose-50",
    border: "border-rose-200",
    quote: "AI can generate ten thousand paintings. Only you know which one makes someone weep.",
    description: "At the intersection of human creativity and generative AI. Da Vinci College trains artists who use AI not as a crutch, but as a collaborator — expanding what human imagination can achieve. The focus is on taste, intention, and the irreplaceable human element in art.",
    courses: "Human-AI Co-Creation · Originality in the Age of Generative AI · Computational Aesthetics",
    coreQuestion: "What does creativity mean when machines can also create?"
  },
  {
    name: "Smith College",
    field: "Economics · Business",
    icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />,
    color: "from-emerald-600 to-green-800",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    quote: "The scarcest business skill in the AI age: knowing what should not be optimized.",
    description: "When AI can forecast markets and optimize supply chains, the human role shifts from execution to judgment. Smith College cultivates leaders who understand what algorithms cannot — ethics, long-term thinking, and the wisdom to know when efficiency is not the goal.",
    courses: "Human-Machine Collaborative Decision Making · Algorithmic Economics · Value-Driven Strategy",
    coreQuestion: "What should never be optimized?"
  },
  {
    name: "Euler College",
    field: "Mathematics · Statistics",
    icon: <Sigma className="w-5 h-5 md:w-6 md:h-6" />,
    color: "from-violet-600 to-purple-800",
    bg: "bg-violet-50",
    border: "border-violet-200",
    quote: "When AI can prove theorems, a mathematician's value is choosing which theorem is worth proving.",
    description: "Mathematics in the age of machine reasoning. Euler College explores how AI transforms mathematical discovery — not by replacing mathematicians, but by acting as an amplifier of mathematical intuition. Students learn to ask the questions that machines cannot yet formulate.",
    courses: "AI-Assisted Mathematical Discovery · Probabilistic Reasoning · Formal Verification",
    coreQuestion: "How does mathematical discovery change when you have a tireless reasoning partner?"
  },
  {
    name: "Curie College",
    field: "Physics · Chemistry",
    icon: <Atom className="w-5 h-5 md:w-6 md:h-6" />,
    color: "from-cyan-600 to-teal-800",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    quote: "AI can simulate a billion experiments. Your value is deciding which experiment is worth running.",
    description: "The scientific method supercharged by machine intelligence. Curie College trains scientists who can harness AI for hypothesis generation, experimental design, and data interpretation — while maintaining the rigor and skepticism that defines true science.",
    courses: "AI-Driven Scientific Discovery Methodology · Computational Physics · Automated Experimentation",
    coreQuestion: "How does science accelerate when AI becomes a partner in discovery?"
  },
  {
    name: "Darwin College",
    field: "Biology · Medicine",
    icon: <Dna className="w-5 h-5 md:w-6 md:h-6" />,
    color: "from-green-600 to-emerald-800",
    bg: "bg-green-50",
    border: "border-green-200",
    quote: "AI can diagnose disease. But only you can hold a patient's hand and say: 'Don't be afraid.'",
    description: "Where AI meets the most human of sciences. Darwin College prepares physicians and biologists who see AI as a diagnostic partner — not a replacement for the human connection that lies at the heart of healing. The focus is on symbiosis between machine precision and human compassion.",
    courses: "Human-Machine Collaborative Diagnostics · AI-Driven Drug Discovery · Computational Biology",
    coreQuestion: "How do we preserve humanity in medicine while embracing AI's power?"
  },
  {
    name: "Aristotle College",
    field: "Philosophy · History",
    icon: <BookOpen className="w-5 h-5 md:w-6 md:h-6" />,
    color: "from-amber-600 to-orange-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    quote: "At the end of every technical question stands a question about what it means to be human.",
    description: "The conscience of the university. Aristotle College grounds every technological advance in the philosophical and historical context that gives it meaning. Students here explore the deepest questions: consciousness, personhood, agency, and the nature of intelligence itself.",
    courses: "Existential Philosophy in the AI Age · History of Intelligence · Ethics of Artificial Minds",
    coreQuestion: "What does it mean to be human when machines think?"
  },
  {
    name: "Montesquieu College",
    field: "Law · Public Policy",
    icon: <Gavel className="w-5 h-5 md:w-6 md:h-6" />,
    color: "from-slate-600 to-gray-800",
    bg: "bg-slate-50",
    border: "border-slate-200",
    quote: "Rewriting the social contract for human-AI coexistence.",
    description: "As AI systems gain agency, every legal and policy framework must be re-examined. Montesquieu College prepares the lawyers, policymakers, and advocates who will shape the rules of human-AI society — from algorithmic accountability to digital personhood.",
    courses: "The Question of AI Legal Personhood · Algorithmic Governance · Digital Rights Framework",
    coreQuestion: "How do we write laws for beings that are neither human nor property?"
  },
  {
    name: "Carson College",
    field: "Environment · Sustainability",
    icon: <Leaf className="w-5 h-5 md:w-6 md:h-6" />,
    color: "from-lime-600 to-green-800",
    bg: "bg-lime-50",
    border: "border-lime-200",
    quote: "AI is the most powerful tool for solving the climate crisis. But only humans can decide what to sacrifice.",
    description: "The planet's most urgent challenges require humanity's most powerful tools. Carson College trains environmental leaders who deploy AI for climate modeling, resource optimization, and ecological restoration — while understanding that technology alone cannot replace political will and ethical choice.",
    courses: "AI-Driven Climate Modeling · Ecological Systems Optimization · Sustainable Technology Policy",
    coreQuestion: "How can AI help us save the planet without making us forget why it matters?"
  },
  {
    name: "Von Braun College",
    field: "Aerospace · Space Science",
    icon: <Rocket className="w-5 h-5 md:w-6 md:h-6" />,
    color: "from-sky-600 to-blue-800",
    bg: "bg-sky-50",
    border: "border-sky-200",
    quote: "On the road to the stars, humans and AI must become the closest of partners.",
    description: "Space exploration is the ultimate test of human-machine collaboration. Von Braun College trains the explorers who will venture beyond Earth — where AI handles the impossible complexity of navigation, life support, and data analysis, while humans provide the curiosity, courage, and adaptability that no machine can replicate.",
    courses: "Human-Machine Collaboration in Deep Space · Autonomous Space Systems · Astrobiology Informatics",
    coreQuestion: "How do humans and AI survive together where neither can survive alone?"
  }
];

export default function Departments() {
  return (
    <div id="departments" className="bg-[var(--color-au-cream)] min-h-screen pt-24 md:pt-32 pb-12 md:pb-20">
      {/* Hero Header */}
      <section className="px-4 mb-12 md:mb-20">
        <div className="max-w-5xl mx-auto text-center space-y-4 md:space-y-6">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="font-display text-[var(--color-au-accent)] tracking-[0.25em] uppercase text-xs md:text-sm"
          >
            Discipline × AI
          </motion.span>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display text-[var(--color-au-blue-dark)] leading-tight"
          >
            Academic <span className="text-[var(--color-au-accent)] italic">Architecture</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-base md:text-xl font-serif text-gray-600 max-w-3xl mx-auto px-2 leading-relaxed"
          >
            Every discipline is deeply integrated with Collaborative Intelligence. 
            Ten colleges, each fundamentally redesigned for the age of human-machine collaboration.
          </motion.p>
        </div>
      </section>

      {/* The Ten Colleges - Detailed Grid */}
      <section className="px-4 mb-12 md:mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <motion.span
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="font-display text-[var(--color-au-accent)] tracking-widest uppercase text-xs md:text-sm"
            >
              Where disciplines meet intelligence
            </motion.span>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-[var(--color-au-blue-dark)] mt-2"
            >
              The Ten <span className="italic">Colleges</span>
            </motion.h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {colleges.map((college, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-white border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 group"
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${college.color} p-5 md:p-8 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {college.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-display text-lg md:text-2xl tracking-wide">{college.name}</h3>
                      <span className="text-white/70 text-[10px] md:text-xs uppercase tracking-[0.15em] font-body">{college.field}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 md:p-8 space-y-4 md:space-y-6">
                  {/* Description */}
                  <p className="font-serif text-sm md:text-base text-gray-700 leading-relaxed">
                    {college.description}
                  </p>

                  {/* Quote */}
                  <div className="bg-[var(--color-au-stone)] p-4 md:p-5 border-l-2 border-[var(--color-au-accent)]">
                    <p className="font-serif text-xs md:text-sm text-gray-600 italic leading-relaxed">
                      "{college.quote}"
                    </p>
                  </div>

                  {/* Courses */}
                  <div className="pt-3 md:pt-4 border-t border-gray-200">
                    <span className="font-display text-[10px] md:text-xs tracking-[0.15em] uppercase text-[var(--color-au-accent)] font-bold">Flagship Courses</span>
                    <p className="font-serif text-xs md:text-sm text-gray-600 mt-1 md:mt-2">{college.courses}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Board of Governors Preview */}
      <section className="px-4 mb-12 md:mb-24">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="font-display text-[var(--color-au-accent)] tracking-widest uppercase text-xs md:text-sm">Human-AI Co-Governance</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-[var(--color-au-blue-dark)] mt-2">
              Board of <span className="italic">Governors</span>
            </h2>
            <p className="text-base md:text-lg font-serif text-gray-600 mt-3 md:mt-4 max-w-2xl mx-auto">
              6 human seats + 3 AI seats. A living experiment in co-governance.
            </p>
            <div className="mt-6 md:mt-8">
              <Link
                to="/board"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-au-blue-dark)] text-white font-display text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-[var(--color-au-accent)] transition-all duration-300"
              >
                Meet the Board
                <ChevronRight className="w-3 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
