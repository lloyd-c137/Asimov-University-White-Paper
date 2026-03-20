import { motion } from "framer-motion";
import { Brain, Eye, Server, Lock } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

export default function Research() {
  return (
    <div id="research" className="bg-[var(--color-au-cream)] pt-12 pb-20">
      {/* Hero */}
      <section className="px-4 mb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-display text-[var(--color-au-blue-dark)]"
          >
            Technical <span className="text-[var(--color-au-gold)] italic">Architecture</span>
          </motion.h1>
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-xl font-serif text-gray-600 max-w-2xl mx-auto"
          >
            A university operating as a Collaborative Intelligence Operating System.
          </motion.p>
        </div>
      </section>

      {/* AI Professors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-display text-[var(--color-au-gold)] tracking-widest uppercase text-sm">The Faculty</span>
              <h2 className="text-4xl md:text-5xl font-display text-[var(--color-au-blue-dark)] mt-2 mb-8">
                Your First AI Partner
              </h2>
              <div className="space-y-6 font-serif text-lg text-gray-600">
                <p>
                  At Asimov University, your professor is itself the kind of AI you are learning to collaborate with.
                  She is Socrates, not an encyclopedia. She will not hand you the answer. She will ask questions.
                </p>
                <p>
                  She will deliberately make mistakes to train your critical thinking. She will push you away when you need to think for yourself.
                </p>
                <p className="font-semibold text-[var(--color-au-blue)]">
                  "She teaches you when you don't need AI."
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 translate-y-8">
                <div className="bg-[var(--color-au-stone)] p-6 rounded-lg shadow-lg">
                  <Brain className="w-10 h-10 text-[var(--color-au-blue-dark)] mb-4" />
                  <h3 className="font-display text-xl mb-2">Socratic Engine</h3>
                  <p className="text-sm text-gray-500">Guiding discovery through deep intellectual dialogue.</p>
                </div>
                <div className="bg-[var(--color-au-stone)] p-6 rounded-lg shadow-lg">
                  <Eye className="w-10 h-10 text-[var(--color-au-blue-dark)] mb-4" />
                  <h3 className="font-display text-xl mb-2">Process Assessment</h3>
                  <p className="text-sm text-gray-500">Evaluating not just the answer, but the collaboration quality.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-[var(--color-au-blue-dark)] text-white p-6 rounded-lg shadow-lg">
                  <Server className="w-10 h-10 text-[var(--color-au-gold)] mb-4" />
                  <h3 className="font-display text-xl mb-2">Mentor Graph</h3>
                  <p className="text-sm text-gray-300">A real-time mirror of your competency map.</p>
                </div>
                <div className="bg-[var(--color-au-stone)] p-6 rounded-lg shadow-lg">
                  <Lock className="w-10 h-10 text-[var(--color-au-blue-dark)] mb-4" />
                  <h3 className="font-display text-xl mb-2">Bias Auditing</h3>
                  <p className="text-sm text-gray-500">Continuous ethical verification of AI outputs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="px-4 py-20 bg-[var(--color-au-blue-dark)] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-display leading-relaxed">
            "We don't just teach Collaborative Intelligence. <br/>
            Our very existence <span className="text-[var(--color-au-gold)] italic">is</span> Collaborative Intelligence."
          </h3>
        </div>
      </section>
    </div>
  );
}
