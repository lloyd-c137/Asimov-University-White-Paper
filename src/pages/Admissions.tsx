import { useState, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Send, User, Cpu, Shield, Globe, Book, Star } from "lucide-react";

export default function Admissions() {
  const [stage, setStage] = useState<"intro" | "chat" | "agreements" | "completed">("intro");
  const [messages, setMessages] = useState<{role: "system" | "user" | "lyra", content: string}[]>([
    { role: "lyra", content: "Greetings. I am Lyra, the Admissions Oracle of Asimov University. I am here to guide you through your matriculation." },
    { role: "lyra", content: "To begin, what name shall I record in the Archives?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agreementsChecked, setAgreementsChecked] = useState({
    charter: false,
    ethics: false,
    data: false,
    symbiosis: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleChatSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate Lyra's response
    setTimeout(() => {
      setIsTyping(false);
      
      if (messages.length === 2) {
        setMessages(prev => [...prev, { role: "lyra", content: `A pleasure to meet you, ${userMessage}.` }, { role: "lyra", content: "Now, tell me: Why do you seek to join Asimov University? What question do you hope to answer here?" }]);
      } else if (messages.length === 5) {
        setMessages(prev => [...prev, { role: "lyra", content: "A fascinating perspective. The intersection of human curiosity and machine logic is where true innovation lies." }, { role: "lyra", content: "Which of our Ten Colleges draws your interest most strongly?" }]);
      } else if (messages.length === 8) {
        setMessages(prev => [...prev, { role: "lyra", content: "An excellent choice. Your responses have been recorded in the Archives." }, { role: "lyra", content: "Before we finalize your application, you must agree to the foundational texts of our institution. Shall we proceed?" }]);
        setTimeout(() => setStage("agreements"), 3000);
      }
    }, 1500);
  };

  const handleAgreementSubmit = () => {
    if (Object.values(agreementsChecked).every(v => v)) {
      setStage("completed");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStage("chat");
  };

  if (stage === "completed") {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-[var(--color-au-blue-dark)] relative overflow-hidden">
        {/* Modern Tech Background with Renaissance Structure */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
           <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(circle_at_50%_50%,_rgba(212,175,55,0.1),transparent_70%)] animate-pulse" style={{ animationDuration: '4s' }}></div>
           <div className="absolute w-[600px] h-[600px] border border-[var(--color-au-accent)]/20 rounded-full rotate-45 animate-spin-slow" style={{ animationDuration: '60s' }}></div>
           <div className="absolute w-[600px] h-[600px] border border-[var(--color-au-blue)]/30 rounded-full -rotate-45 animate-spin-slow" style={{ animationDuration: '40s', animationDirection: 'reverse' }}></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl w-full bg-[var(--color-au-blue-dark)]/80 backdrop-blur-md p-16 text-center shadow-[0_0_80px_rgba(212,175,55,0.2)] relative border border-[var(--color-au-accent)]/40"
        >
          {/* Ornate Corners */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[var(--color-au-accent)]">
            <div className="absolute top-2 left-2 w-2 h-2 bg-[var(--color-au-accent)] rotate-45"></div>
          </div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[var(--color-au-accent)]">
            <div className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-au-accent)] rotate-45"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[var(--color-au-accent)]">
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-[var(--color-au-accent)] rotate-45"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[var(--color-au-accent)]">
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-[var(--color-au-accent)] rotate-45"></div>
          </div>
          
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            className="w-24 h-24 bg-gradient-to-br from-[var(--color-au-accent)] to-[var(--color-au-accent-dark)] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(212,175,55,0.5)] relative"
          >
            <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" style={{ animationDuration: '3s' }}></div>
            <Star className="w-12 h-12 text-white drop-shadow-md" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h2 className="text-4xl font-display text-[var(--color-au-accent)] mb-6 tracking-wide">Matriculation Initiated</h2>
            <div className="w-24 h-px bg-[var(--color-au-accent)]/50 mx-auto mb-6"></div>
            <p className="font-serif text-gray-300 mb-8 leading-relaxed text-lg">
              Your consciousness pattern has been registered in the Great Archives. 
              The Oracle will review your dialogue. Expect a transmission via digital courier within 14 cycles.
            </p>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-[var(--color-au-blue)] font-bold">
              Welcome to the Future, Architect.
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (stage === "agreements") {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 bg-[var(--color-au-blue-dark)] relative flex justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl w-full bg-white/5 backdrop-blur-lg border border-[var(--color-au-accent)]/30 p-10 shadow-2xl relative"
        >
          <div className="text-center mb-10">
            <Shield className="w-12 h-12 text-[var(--color-au-accent)] mx-auto mb-4" />
            <h2 className="text-3xl font-display text-white">Foundational Covenants</h2>
            <p className="font-serif text-gray-400 mt-2">Acknowledge the principles of Collaborative Intelligence.</p>
          </div>

          <div className="space-y-6 mb-10">
            {[
              { id: 'charter', title: 'The University Charter', desc: 'Commitment to the pursuit of knowledge beyond human limits.', icon: <Book className="w-5 h-5" /> },
              { id: 'ethics', title: 'Code of Synthetic Ethics', desc: 'Guidelines for responsible interaction with artificial minds.', icon: <Shield className="w-5 h-5" /> },
              { id: 'data', title: 'Cognitive Data Agreement', desc: 'Protocols for the storage and use of your thought patterns.', icon: <Globe className="w-5 h-5" /> },
              { id: 'symbiosis', title: 'Pact of Symbiosis', desc: 'The ultimate agreement to treat AI as a partner, not a tool.', icon: <Cpu className="w-5 h-5" /> }
            ].map((doc) => (
              <label key={doc.id} className={`flex items-start space-x-4 p-4 border rounded cursor-pointer transition-all ${agreementsChecked[doc.id as keyof typeof agreementsChecked] ? 'border-[var(--color-au-accent)] bg-[var(--color-au-accent)]/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                <div className="mt-1">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-[var(--color-au-accent)] cursor-pointer"
                    checked={agreementsChecked[doc.id as keyof typeof agreementsChecked]}
                    onChange={(e) => setAgreementsChecked({...agreementsChecked, [doc.id]: e.target.checked})}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-[var(--color-au-accent)] mb-1">
                    {doc.icon}
                    <h4 className="font-display tracking-widest uppercase text-sm">{doc.title}</h4>
                  </div>
                  <p className="font-serif text-gray-400 text-sm">{doc.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <button 
            onClick={handleAgreementSubmit}
            disabled={!Object.values(agreementsChecked).every(v => v)}
            className="w-full py-4 bg-[var(--color-au-accent)] text-[var(--color-au-blue-dark)] font-display uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors font-bold"
          >
            Sign & Transmit Application
          </button>
        </motion.div>
      </div>
    );
  }

  if (stage === "chat") {
    return (
      <div className="min-h-screen pt-24 pb-0 flex flex-col bg-[var(--color-au-cream)] relative">
        {/* Chat Header */}
        <div className="bg-[var(--color-au-blue-dark)] text-white py-4 px-6 shadow-md z-10 border-b-4 border-[var(--color-au-accent)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-au-accent)]/20 flex items-center justify-center border border-[var(--color-au-accent)] relative">
              <Cpu className="w-5 h-5 text-[var(--color-au-accent)]" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="font-display tracking-widest uppercase text-sm">Lyra</h2>
              <p className="text-xs font-serif text-[var(--color-au-accent)]">Admissions Oracle</p>
            </div>
          </div>
          <div className="text-xs font-mono text-gray-400 opacity-50">
            SECURE CHANNEL
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(212,175,55,0.03) 0%, transparent 100%)' }}>
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] md:max-w-[60%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border ${msg.role === 'user' ? 'bg-[var(--color-au-blue-dark)] border-[var(--color-au-blue)]' : 'bg-white border-[var(--color-au-accent)]'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Feather className="w-4 h-4 text-[var(--color-au-accent)]" />}
                  </div>
                  <div className={`p-4 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[var(--color-au-blue-dark)] text-white rounded-t-2xl rounded-l-2xl border border-[var(--color-au-blue)]' 
                      : 'bg-white text-[var(--color-au-blue-dark)] rounded-t-2xl rounded-r-2xl border border-[var(--color-au-accent)]/30'
                  }`}>
                    <p className="font-serif leading-relaxed text-lg">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 items-end">
                  <div className="w-8 h-8 rounded-full bg-white border border-[var(--color-au-accent)] flex items-center justify-center">
                    <Feather className="w-4 h-4 text-[var(--color-au-accent)]" />
                  </div>
                  <div className="bg-white border border-[var(--color-au-accent)]/30 p-4 rounded-t-2xl rounded-r-2xl shadow-sm flex space-x-2">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-[var(--color-au-accent)]/50 rounded-full"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-[var(--color-au-accent)]/50 rounded-full"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-[var(--color-au-accent)]/50 rounded-full"></motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-[var(--color-au-accent)]/20 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleChatSubmit} className="max-w-4xl mx-auto relative flex items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Speak to Lyra..."
              disabled={isTyping}
              className="w-full bg-[var(--color-au-cream)] border border-[var(--color-au-accent)]/30 rounded-full py-4 pl-6 pr-16 outline-none font-serif text-lg text-[var(--color-au-blue-dark)] focus:border-[var(--color-au-accent)] transition-colors disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={isTyping || !inputValue.trim()}
              className="absolute right-2 p-3 bg-[var(--color-au-blue-dark)] text-[var(--color-au-accent)] rounded-full hover:bg-[var(--color-au-accent)] hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-[var(--color-au-blue-dark)] disabled:hover:text-[var(--color-au-accent)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-[var(--color-au-blue-dark)] relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute w-[800px] h-[800px] bg-[var(--color-au-blue)] rounded-full blur-[150px] opacity-20 -top-20 -right-20"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        <motion.div 
          className="absolute w-[600px] h-[600px] bg-[var(--color-au-accent)] rounded-full blur-[180px] opacity-10 -bottom-20 -left-20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        ></motion.div>
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: "radial-gradient(circle at 50% 50%, #2563eb 1px, transparent 1px)",
               backgroundSize: "40px 40px"
             }}>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[var(--color-au-accent)] tracking-widest uppercase font-display text-sm">Fall 2050 Cohort</span>
            <h1 className="text-5xl md:text-6xl font-display text-white mt-4 mb-6">Application for Matriculation</h1>
            <p className="font-serif text-xl text-gray-300 max-w-2xl mx-auto italic">
              "To ask the right question is the greater half of knowing."
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[var(--color-au-blue-dark)]/80 backdrop-blur-md p-8 md:p-12 border border-[var(--color-au-accent)]/30 shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] relative"
        >
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--color-au-accent)]"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[var(--color-au-accent)]"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[var(--color-au-accent)]"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--color-au-accent)]"></div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4 group">
                <label className="block font-display text-sm uppercase tracking-widest text-[var(--color-au-accent)] group-hover:text-white transition-colors">Candidate Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-transparent border-b border-[var(--color-au-accent)]/30 focus:border-[var(--color-au-accent)] px-2 py-3 outline-none font-serif text-lg text-white transition-all placeholder:text-gray-600 focus:bg-[var(--color-au-accent)]/5"
                  placeholder="e.g. Ada Lovelace"
                />
              </div>
              <div className="space-y-4 group">
                <label className="block font-display text-sm uppercase tracking-widest text-[var(--color-au-accent)] group-hover:text-white transition-colors">Comm Frequency (Email)</label>
                <input 
                  required
                  type="email" 
                  className="w-full bg-transparent border-b border-[var(--color-au-accent)]/30 focus:border-[var(--color-au-accent)] px-2 py-3 outline-none font-serif text-lg text-white transition-all placeholder:text-gray-600 focus:bg-[var(--color-au-accent)]/5"
                  placeholder="ada@example.com"
                />
              </div>
            </div>

            <div className="space-y-6">
              <label className="block font-display text-sm uppercase tracking-widest text-[var(--color-au-accent)]">Select Faculty</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Cognitive Computing", "Algorithmic Ethics", "Robotic Architecture", "Planetary Systems", "Humanities & Logic", "Prompt Engineering Arts"].map((opt) => (
                  <label key={opt} className="flex items-center space-x-3 cursor-pointer group p-3 border border-transparent hover:border-[var(--color-au-accent)]/30 hover:bg-[var(--color-au-accent)]/5 transition-all rounded-sm">
                    <input type="radio" name="faculty" className="peer sr-only" required />
                    <div className="w-4 h-4 border border-[var(--color-au-accent)]/50 peer-checked:bg-[var(--color-au-accent)] peer-checked:border-[var(--color-au-accent)] flex items-center justify-center transition-all rotate-45">
                      <div className="w-1.5 h-1.5 bg-[var(--color-au-blue-dark)] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="font-serif text-gray-400 group-hover:text-white peer-checked:text-[var(--color-au-accent)] transition-colors text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block font-display text-sm uppercase tracking-widest text-[var(--color-au-accent)]">
                The Essay: Why Do You Ask?
              </label>
              <p className="text-xs font-serif text-gray-500 mb-2">
                In 500 words or less, describe a question that a machine cannot yet answer, and why it matters.
              </p>
              <div className="relative group">
                <textarea 
                  required
                  rows={6}
                  className="w-full bg-[var(--color-au-blue-dark)] border border-[var(--color-au-accent)]/30 focus:border-[var(--color-au-accent)] p-6 outline-none font-serif text-lg text-gray-300 leading-relaxed transition-all resize-none group-hover:bg-[var(--color-au-accent)]/5"
                  placeholder="Begin your response here..."
                ></textarea>
                <Feather className="absolute right-4 bottom-4 text-[var(--color-au-accent)]/50 w-5 h-5" />
              </div>
            </div>

            <div className="pt-8 border-t border-[var(--color-au-accent)]/20 flex justify-center">
              <button 
                type="submit"
                className="group relative inline-block px-12 py-5 bg-[var(--color-au-blue-dark)] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
              >
                {/* Renaissance Frame Elements */}
                <div className="absolute inset-0 border border-[var(--color-au-accent)] opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--color-au-accent)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--color-au-accent)]"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--color-au-accent)]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--color-au-accent)] group-hover:w-full group-hover:h-full transition-all duration-500"></div>
                
                {/* Stronger Modern Tech Glow Scan */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-au-accent)]/60 to-transparent skew-x-12"
                  animate={{ x: ["-150%", "150%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
                />
                
                {/* Pulsing Background Glow */}
                <motion.div
                  className="absolute inset-0 bg-[var(--color-au-blue)] opacity-0 group-hover:opacity-30"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Text with Ethereal Glow */}
                <div className="relative z-10 flex items-center gap-3">
                  <span className="font-display text-xl tracking-[0.3em] uppercase text-white group-hover:text-[var(--color-au-accent)] transition-colors duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,1)]">
                    Transmit Application
                  </span>
                </div>
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
