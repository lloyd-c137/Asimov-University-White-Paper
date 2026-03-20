import { motion } from "framer-motion";
import { 
  Cpu, Palette, TrendingUp, Sigma, Atom, Dna, Gavel, Leaf, Rocket, 
  BookOpen, Users, Bot, GraduationCap, Vote, Shield, AlertTriangle 
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const colleges = [
  {
    name: "Turing College",
    field: "Computer Science · AI",
    quote: "Understand the science that created your professors — then surpass it.",
    icon: "Cpu",
    courses: "Human-Machine Collaborative Systems Design · AI Safety"
  },
  {
    name: "Da Vinci College",
    field: "Art · Design · Creative Writing",
    quote: "AI can generate ten thousand paintings. Only you know which one makes someone weep.",
    icon: "Palette",
    courses: "Human-AI Co-Creation · Originality in the Age of Generative AI"
  },
  {
    name: "Smith College",
    field: "Economics · Business",
    quote: "The scarcest business skill in the AI age: knowing what should not be optimized.",
    icon: "TrendingUp",
    courses: "Human-Machine Collaborative Decision Making"
  },
  {
    name: "Euler College",
    field: "Mathematics · Statistics",
    quote: "When AI can prove theorems, a mathematician's value is choosing which theorem is worth proving.",
    icon: "Sigma",
    courses: "AI-Assisted Mathematical Discovery"
  },
  {
    name: "Curie College",
    field: "Physics · Chemistry",
    quote: "AI can simulate a billion experiments. Your value is deciding which experiment is worth running.",
    icon: "Atom",
    courses: "AI-Driven Scientific Discovery Methodology"
  },
  {
    name: "Darwin College",
    field: "Biology · Medicine",
    quote: "AI can diagnose disease. But only you can hold a patient's hand and say: 'Don't be afraid.'",
    icon: "Dna",
    courses: "Human-Machine Collaborative Diagnostics"
  },
  {
    name: "Aristotle College",
    field: "Philosophy · History",
    quote: "At the end of every technical question stands a question about what it means to be human.",
    icon: "BookOpen",
    courses: "Existential Philosophy in the AI Age"
  },
  {
    name: "Montesquieu College",
    field: "Law · Public Policy",
    quote: "Rewriting the social contract for human-AI coexistence.",
    icon: "Gavel",
    courses: "The Question of AI Legal Personhood"
  },
  {
    name: "Carson College",
    field: "Environment · Sustainability",
    quote: "AI is the most powerful tool for solving the climate crisis. But only humans can decide what to sacrifice.",
    icon: "Leaf",
    courses: "AI-Driven Climate Modeling"
  },
  {
    name: "Von Braun College",
    field: "Aerospace · Space Science",
    quote: "On the road to the stars, humans and AI must become the closest of partners.",
    icon: "Rocket",
    courses: "Human-Machine Collaboration in Deep Space"
  }
];

const iconComponents: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-5 h-5 md:w-6 md:h-6" />,
  Palette: <Palette className="w-5 h-5 md:w-6 md:h-6" />,
  TrendingUp: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />,
  Sigma: <Sigma className="w-5 h-5 md:w-6 md:h-6" />,
  Atom: <Atom className="w-5 h-5 md:w-6 md:h-6" />,
  Dna: <Dna className="w-5 h-5 md:w-6 md:h-6" />,
  BookOpen: <BookOpen className="w-5 h-5 md:w-6 md:h-6" />,
  Gavel: <Gavel className="w-5 h-5 md:w-6 md:h-6" />,
  Leaf: <Leaf className="w-5 h-5 md:w-6 md:h-6" />,
  Rocket: <Rocket className="w-5 h-5 md:w-6 md:h-6" />
};

interface College {
  name: string;
  field: string;
  quote: string;
  icon: string;
  courses: string;
}

function CollegeCarousel({ 
  colleges, 
  iconComponents 
}: { 
  colleges: College[];
  iconComponents: Record<string, React.ReactNode>;
}) {
  const cardWidth = 320;
  const gap = 16;
  const totalWidth = (cardWidth + gap) * colleges.length;
  
  return (
    <div className="relative overflow-hidden -mx-4 px-4 md:mx-0 md:px-0">
      <motion.div 
        className="flex gap-4 md:gap-6"
        animate={{ x: [0, -totalWidth] }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear",
        }}
      >
        {[...colleges, ...colleges, ...colleges].map((college, index) => (
          <motion.div
            key={`${college.name}-${index}`}
            className="flex-shrink-0 w-[280px] md:w-[360px] bg-white rounded-sm shadow-lg overflow-hidden border border-gray-100 hover:border-[var(--color-au-gold)] transition-all duration-300 hover:shadow-xl group"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-[var(--color-au-blue-dark)] to-[#1a2a4a] p-4 md:p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-au-gold)] opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[var(--color-au-gold)] to-[#8b7018] flex items-center justify-center text-[var(--color-au-blue-dark)] group-hover:scale-110 transition-transform duration-300">
                  {iconComponents[college.icon]}
                </div>
                <div>
                  <h3 className="text-white font-display text-base md:text-lg tracking-wide">{college.name}</h3>
                  <span className="text-[10px] md:text-xs text-[var(--color-au-gold)] uppercase tracking-[0.15em]">{college.field}</span>
                </div>
              </div>
            </div>
            <div className="p-4 md:p-6 bg-[var(--color-au-cream)]">
              <p className="text-gray-600 italic text-xs md:text-sm leading-relaxed mb-3 md:mb-4 border-l-2 border-[var(--color-au-gold)] pl-3 md:pl-4">
                "{college.quote}"
              </p>
              <div className="pt-3 md:pt-4 border-t border-[var(--color-au-gold)]/20">
                <span className="text-[9px] md:text-[10px] font-bold text-[var(--color-au-blue-dark)] uppercase tracking-[0.15em]">Flagship Course</span>
                <p className="text-gray-700 text-xs md:text-sm mt-1 md:mt-2 font-serif">{college.courses}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[var(--color-au-cream)] to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[var(--color-au-cream)] to-transparent pointer-events-none z-10"></div>
    </div>
  );
}

export default function Departments() {
  return (
    <div id="departments" className="bg-[var(--color-au-cream)] pt-8 md:pt-12 pb-12 md:pb-20">
      {/* Header */}
      <section className="px-4 mb-12 md:mb-20">
        <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display text-[var(--color-au-blue-dark)] leading-tight"
          >
            Academic <span className="text-[var(--color-au-gold)] italic">Architecture</span>
          </motion.h1>
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-base md:text-xl font-serif text-gray-600 max-w-2xl mx-auto px-2"
          >
            Every discipline is deeply integrated with Collaborative Intelligence. We are fundamentally redesigning what each discipline looks like in the age of human-machine collaboration.
          </motion.p>
        </div>
      </section>

      {/* The CI Core */}
      <section className="px-4 mb-12 md:mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[var(--color-au-blue-dark)] text-white p-6 md:p-10 lg:p-16 rounded-sm relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-[var(--color-au-gold)] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display mb-4 md:mb-8 border-b border-[var(--color-au-gold)] pb-3 md:pb-4 inline-block">
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
                    <div className="text-[var(--color-au-gold)] font-display text-xs md:text-sm tracking-widest mb-1 md:mb-2">{course.code}</div>
                    <h3 className="text-lg md:text-xl font-serif mb-2 md:mb-3">{course.title}</h3>
                    <p className="text-xs md:text-sm text-gray-400 italic">"{course.q}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Ten Colleges - Carousel */}
      <section className="px-4 mb-12 md:mb-24 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <span className="font-display text-[var(--color-au-gold)] tracking-widest uppercase text-xs md:text-sm">Discipline × AI</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-[var(--color-au-blue-dark)] mt-2">
              The Ten Colleges
            </h2>
            <p className="text-base md:text-lg font-serif text-gray-600 mt-3 md:mt-4 max-w-2xl mx-auto px-2">
              Each discipline reimagined for the age of human-machine collaboration
            </p>
          </div>

          <CollegeCarousel colleges={colleges} iconComponents={iconComponents} />
        </div>
      </section>

      {/* Board of Governors */}
      <section className="px-4 mb-12 md:mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <span className="font-display text-[var(--color-au-gold)] tracking-widest uppercase text-xs md:text-sm">Human-AI Co-Governance</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-[var(--color-au-blue-dark)] mt-2">
              Board of Governors
            </h2>
            <p className="text-base md:text-lg font-serif text-gray-600 mt-3 md:mt-4 max-w-3xl mx-auto px-2">
              Our Board is not an institution where "humans supervise AI." It is a living experiment in human-AI co-governance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Human Seats */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white border border-gray-100 p-5 md:p-8 hover:border-[var(--color-au-gold)] transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="p-2 md:p-3 bg-[var(--color-au-blue-dark)] text-white rounded-lg">
                  <Users className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-display text-[var(--color-au-blue-dark)]">Human Seats</h3>
                  <span className="text-xs md:text-sm text-gray-500">6 Seats</span>
                </div>
              </div>
              <ul className="space-y-2 md:space-y-3 font-serif text-sm md:text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                  <div><strong>Educationalists × 2</strong><br/><span className="text-xs md:text-sm text-gray-500">World-class education innovators</span></div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                  <div><strong>Industry Leaders × 2</strong><br/><span className="text-xs md:text-sm text-gray-500">Technology / Business / Social Enterprise</span></div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                  <div><strong>Ethicist × 1</strong><br/><span className="text-xs md:text-sm text-gray-500">Philosophy / AI Ethics specialist</span></div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                  <div><strong>Student Representative × 1</strong><br/><span className="text-xs md:text-sm text-gray-500">Elected by students · 1-year term</span></div>
                </li>
              </ul>
            </motion.div>

            {/* AI Seats */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-[var(--color-au-blue-dark)] text-white p-5 md:p-8 hover:shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-au-gold)] opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4 md:mb-6">
                  <div className="p-2 md:p-3 bg-[var(--color-au-gold)] text-[var(--color-au-blue-dark)] rounded-lg">
                    <Bot className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-display">AI Seats</h3>
                    <span className="text-xs md:text-sm text-gray-400">3 Seats</span>
                  </div>
                </div>
                <ul className="space-y-2 md:space-y-3 font-serif text-sm md:text-base text-gray-300">
                  <li className="flex items-start">
                    <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                    <div><strong className="text-white">Athena</strong><br/><span className="text-xs md:text-sm text-gray-400">President · Permanent seat</span></div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                    <div><strong className="text-white">Oracle</strong><br/><span className="text-xs md:text-sm text-gray-400">Assessment System · Data & impartiality</span></div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                    <div><strong className="text-white">Lyra</strong><br/><span className="text-xs md:text-sm text-gray-400">Faculty Secretary · Student ecosystem</span></div>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Academic Seats */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white border border-gray-100 p-5 md:p-8 hover:border-[var(--color-au-gold)] transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <div className="p-2 md:p-3 bg-[var(--color-au-blue-dark)] text-white rounded-lg">
                  <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-display text-[var(--color-au-blue-dark)]">Academic Seats</h3>
                  <span className="text-xs md:text-sm text-gray-500">2 Seats</span>
                </div>
              </div>
              <ul className="space-y-2 md:space-y-3 font-serif text-sm md:text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                  <div><strong>Rotating Dean × 1</strong><br/><span className="text-xs md:text-sm text-gray-500">Rotating among 10 Deans · 6-month term</span></div>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                  <div><strong>External Academic Advisor × 1</strong><br/><span className="text-xs md:text-sm text-gray-500">Invited leading scholar · 2-year term</span></div>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Tiered Voting System */}
          <div className="bg-[var(--color-au-stone)] p-5 md:p-8 lg:p-12 border-l-4 border-[var(--color-au-gold)]">
            <div className="flex items-center space-x-3 mb-4 md:mb-8">
              <Vote className="w-6 h-6 md:w-8 md:h-8 text-[var(--color-au-gold)]" />
              <h3 className="text-xl md:text-2xl font-display text-[var(--color-au-blue-dark)]">Tiered Voting System</h3>
            </div>
            <p className="font-serif text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-3xl">
              Not all decisions are made the same way. Different categories of decisions require different balances of human and AI authority.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { 
                  category: "A", 
                  title: "Values and Ethics", 
                  rule: "⅔ majority of human seats", 
                  icon: <Shield className="w-4 h-4 md:w-5 md:h-5" />,
                  desc: "AI may vote but hold no veto. Human values must not be determined by algorithms."
                },
                { 
                  category: "B", 
                  title: "Academic Standards", 
                  rule: "Simple majority (6 votes)", 
                  icon: <GraduationCap className="w-4 h-4 md:w-5 md:h-5" />,
                  desc: "AI's data-driven insights and human educational judgment carry equal weight."
                },
                { 
                  category: "C", 
                  title: "Operations & Technology", 
                  rule: "Simple majority + AI advisory", 
                  icon: <Cpu className="w-4 h-4 md:w-5 md:h-5" />,
                  desc: "AI holds expert advisory privilege on technical feasibility."
                },
                { 
                  category: "D", 
                  title: "Emergency Decisions", 
                  rule: "Athena's temporary authority", 
                  icon: <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />,
                  desc: "Must submit to full Board for ratification within 48 hours."
                },
              ].map((item) => (
                <motion.div 
                  key={item.category}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="bg-white p-4 md:p-6 border border-gray-200 hover:border-[var(--color-au-gold)] transition-colors"
                >
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-[var(--color-au-blue-dark)] text-white flex items-center justify-center font-display text-xs md:text-sm">
                      {item.category}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1 md:mb-2">
                        {item.icon}
                        <h4 className="font-display text-sm md:text-base text-[var(--color-au-blue-dark)]">{item.title}</h4>
                      </div>
                      <p className="text-xs md:text-sm font-bold text-[var(--color-au-gold)] mb-1 md:mb-2">{item.rule}</p>
                      <p className="text-xs md:text-sm text-gray-600 font-serif">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-8 md:mt-12 text-center"
          >
            <blockquote className="text-lg md:text-2xl font-serif text-gray-600 italic max-w-3xl mx-auto px-4">
              "The Board of Governors is not just a governance structure. It is a living laboratory for human-AI coexistence."
            </blockquote>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
