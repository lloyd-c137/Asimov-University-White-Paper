import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Globe, User, Brain, BookOpen, Palette, Scale, Building2, Coins, Users } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const stories = [
  {
    location: "Mumbai, 3:00 AM",
    role: "Student",
    content: "A girl sits before her phone screen. Her AI professor is discussing protein folding with her in Hindi. She finds the answer herself. Her eyes light up."
  },
  {
    location: "Nairobi, 2:00 PM",
    role: "Teenager",
    content: "Collaborating on a clean energy project. He overrules AI's recommendation due to a cultural factor. The AI says: 'You considered something I missed.'"
  },
  {
    location: "São Paulo, 9:00 PM",
    role: "Taxi Driver",
    content: "Taking his first course — CI-101. He used to think AI was coming to steal his job. Now he is beginning to understand: AI is a partner."
  },
  {
    location: "Helsinki, 6:00 AM",
    role: "Retired Professor",
    content: "Learning to collaborate with AI to discover new particles. 'You're more reliable than any assistant,' she says. The AI replies: 'But you have better taste.'"
  }
];

export default function News() {

  return (
    <div id="news" className="bg-[var(--color-au-cream)] pt-12 pb-20">
      {/* Header */}
      <section className="px-4 mb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-display text-[var(--color-au-blue-dark)]"
          >
            News & <span className="text-[var(--color-au-gold)] italic">Perspectives</span>
          </motion.h1>
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-xl font-serif text-gray-600 max-w-2xl mx-auto"
          >
            Updates from the world's first AI-native university and stories from the future of education.
          </motion.p>
        </div>
      </section>

      {/* Featured News */}
      <section className="px-4 mb-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-[var(--color-au-blue-dark)] text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-au-blue-dark)] to-transparent z-10"></div>
            {/* Abstract Background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[var(--color-au-gold)] via-transparent to-transparent"></div>
            </div>
            
            <div className="relative z-20 p-10 md:p-16 max-w-2xl">
              <div className="flex items-center space-x-2 text-[var(--color-au-gold)] mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-display tracking-widest uppercase">March 15, 2026</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display mb-6 leading-tight">
                Asimov University Launches: The Dawn of Collaborative Intelligence
              </h2>
              <p className="font-serif text-lg text-gray-300 mb-8">
                We announce the founding of the world's first university dedicated entirely to the study, development, and ethical application of Artificial Intelligence.
              </p>
              <button className="flex items-center space-x-2 text-[var(--color-au-gold)] hover:text-white transition-colors font-display uppercase tracking-widest text-sm group">
                <span>Read Whitepaper</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="px-4 mb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-[var(--color-au-blue-dark)]">
              Our Roadmap
            </h2>
            <p className="font-serif text-gray-500 mt-2">From Zero to One Hundred Million.</p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--color-au-gold)] before:to-transparent">
            {[
              { phase: "Alpha", time: "Year 0–1", milestones: "CI Core development · First 3 colleges online · 1,000 beta students" },
              { phase: "Beta", time: "Year 1–2", milestones: "All 10 colleges online · First CI Certificates issued · 100,000 students" },
              { phase: "1.0", time: "Year 2–3", milestones: "Formal degree programs · Enterprise CI training launched · 1,000,000 students" },
              { phase: "Scale", time: "Year 3–5", milestones: "International accreditation · Full multilingual coverage · 10,000,000 students" },
              { phase: "Vision", time: "Year 5–10", milestones: "World's largest CI education institution · 100,000,000 students" }
            ].map((item) => (
              <div key={item.phase} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[var(--color-au-stone)] group-hover:bg-[var(--color-au-gold)] group-hover:text-white transition-colors shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-3 h-3 bg-[var(--color-au-blue-dark)] rounded-full"></div>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-bold text-[var(--color-au-blue-dark)]">{item.phase}</span>
                    <span className="text-xs font-serif text-gray-500">{item.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm font-serif">{item.milestones}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories from the Future */}
      <section className="px-4 bg-[var(--color-au-stone)] py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-au-gold)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="font-display text-[var(--color-au-gold)] tracking-widest uppercase text-sm">Visions</span>
            <h2 className="text-4xl md:text-5xl font-display text-[var(--color-au-blue-dark)] mt-2">
              Stories from the Future
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-10 shadow-sm hover:shadow-2xl transition-all duration-500 group border-l-4 border-transparent hover:border-[var(--color-au-gold)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3 text-[var(--color-au-blue-dark)]">
                    <div className="p-2 bg-[var(--color-au-stone)] rounded-full group-hover:bg-[var(--color-au-gold)] group-hover:text-white transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="font-display tracking-widest uppercase text-xs font-bold">{story.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                     <User className="w-4 h-4"/>
                     <span className="font-serif italic text-sm">{story.role}</span>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -top-4 -left-2 text-6xl font-serif text-[var(--color-au-gold)]/20">"</span>
                  <p className="text-gray-700 font-serif text-lg leading-relaxed relative z-10 pl-4">
                    {story.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Need - Recruitment Section */}
      <section className="px-4 py-24 bg-[var(--color-au-blue-dark)] text-white overflow-hidden relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-au-gold)] rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="font-display text-[var(--color-au-gold)] tracking-[0.4em] uppercase text-sm"
            >
              Fellow Travelers
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display mt-4"
            >
              Who We <span className="italic text-[var(--color-au-gold)]">Need</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-xl text-gray-300 mt-6 max-w-3xl mx-auto"
            >
              We are not just building a school; we are building a new relationship between species. Join us in this intelligence revolution.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI Scientists & Engineers",
                desc: "To build teaching intelligences that have never existed before.",
                icon: <Brain className="w-6 h-6" />,
                tag: "Technology"
              },
              {
                title: "Education Scientists",
                desc: "To define the methodology of Collaborative Intelligence education.",
                icon: <BookOpen className="w-6 h-6" />,
                tag: "Research"
              },
              {
                title: "Designers & Architects",
                desc: "To make the experience of human-AI collaboration feel effortless.",
                icon: <Palette className="w-6 h-6" />,
                tag: "Creative"
              },
              {
                title: "Ethicists & Policy Experts",
                desc: "To ensure we stay on the right path in this uncharted territory.",
                icon: <Scale className="w-6 h-6" />,
                tag: "Ethics"
              },
              {
                title: "Industry Leaders",
                desc: "To join our Board of Governors and guide our strategic direction.",
                icon: <Building2 className="w-6 h-6" />,
                tag: "Leadership"
              },
              {
                title: "Investors & Partners",
                desc: "Who believe Collaborative Intelligence is humanity's future.",
                icon: <Coins className="w-6 h-6" />,
                tag: "Capital"
              }
            ].map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white/5 border border-white/10 p-8 hover:bg-white/10 hover:border-[var(--color-au-gold)]/50 transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-au-gold)]/10 rounded-full blur-2xl group-hover:bg-[var(--color-au-gold)]/20 transition-all duration-500"></div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-[var(--color-au-blue-dark)] text-[var(--color-au-gold)] border border-[var(--color-au-gold)]/30 rounded-sm group-hover:scale-110 transition-transform duration-300">
                    {role.icon}
                  </div>
                  <span className="text-[10px] font-display tracking-[0.2em] text-gray-500 uppercase">{role.tag}</span>
                </div>
                
                <h3 className="text-xl font-display mb-4 text-white group-hover:text-[var(--color-au-gold)] transition-colors">
                  {role.title}
                </h3>
                <p className="font-serif text-gray-400 text-sm leading-relaxed mb-6">
                  {role.desc}
                </p>
                
                <Link to="/apply" className="text-[var(--color-au-gold)] text-xs font-display tracking-widest uppercase flex items-center space-x-2 group/btn">
                  <span>Enlist Now</span>
                  <ArrowRight className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Student Recruitment CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-20 p-10 md:p-16 bg-gradient-to-br from-[var(--color-au-gold)]/20 to-transparent border border-[var(--color-au-gold)] shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--color-au-gold)]"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--color-au-gold)]"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3 text-[var(--color-au-gold)] mb-4">
                  <Users className="w-6 h-6" />
                  <span className="font-display tracking-widest uppercase text-sm">Our First Students</span>
                </div>
                <h3 className="text-3xl font-display mb-4">Brave souls willing to walk a path no one has walked before.</h3>
                <p className="font-serif text-gray-300">
                  Asimov University has no entrance exams. No age limits. No nationality requirements. 
                  Collaborative Intelligence is a survival skill for every human being.
                </p>
              </div>
              <div className="shrink-0">
                <Link to="/apply" className="group relative inline-block px-12 py-5 bg-[var(--color-au-blue-dark)] overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                  <div className="absolute inset-0 border border-[var(--color-au-gold)] opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--color-au-gold)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--color-au-gold)]"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--color-au-gold)]"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--color-au-gold)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                  
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
                  
                  <span className="relative z-10 font-display text-xl tracking-[0.3em] uppercase text-white group-hover:text-[var(--color-au-gold)] transition-colors duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,1)]">
                    APPLY
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
