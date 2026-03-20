export default function About() {
  return (
    <div id="about" className="bg-[var(--color-au-cream)] pt-8 md:pt-12 pb-12 md:pb-20">
      {/* The Fracture */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display text-[var(--color-au-blue-dark)] mb-4 md:mb-6">
              The Fracture
            </h2>
            <p className="font-serif text-base md:text-lg text-gray-600 mb-4 md:mb-6">
              We are training people for a world that no longer exists. 
              Traditional education teaches students to memorize knowledge and follow processes—things AI already does better.
            </p>
            <p className="font-serif text-base md:text-lg text-gray-600">
              The future needs an entirely new kind of person: Someone who can think alongside AI. 
              Someone who can judge when to trust it and when not to. 
              Someone who can create what neither human nor machine could create alone.
            </p>
          </div>
          <div className="order-1 md:order-2 bg-[var(--color-au-stone)] p-6 md:p-10 border-l-4 border-[var(--color-au-gold)]">
            <h3 className="text-xl md:text-2xl font-display text-[var(--color-au-blue-dark)] mb-3 md:mb-4">
              Our Mission
            </h3>
            <ul className="space-y-3 md:space-y-4 font-serif text-sm md:text-base text-gray-700">
              <li className="flex items-start">
                <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                <span>To train the next generation of AI architects and ethicists.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                <span>To push the boundaries of what is possible in AI research.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-au-gold)] mr-2 mt-1">•</span>
                <span>To provide ethical frameworks for the global deployment of AI.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
