export default function Features() {
  const features = [
    { icon: "✍️", title: "Effortless Note-Taking", desc: "Create, organize, and find your notes instantly." },
    { icon: "🤖", title: "AI Conversations", desc: "Chat with AI about any note. Get summaries, expand ideas." },
    { icon: "🔍", title: "Smart Search", desc: "Find exactly what you're looking for with AI-powered search." },
    { icon: "🎨", title: "Beautiful Interface", desc: "A clean, distraction-free environment that adapts to you." },
    { icon: "⚡", title: "Lightning Fast", desc: "Instant sync across devices with blazing speed." },
    { icon: "🔒", title: "Private & Secure", desc: "End-to-end encryption keeps your thoughts safe." },
  ];

  return (
    <section
      id="features"
      className="py-32 px-6 sm:px-10 max-w-7xl mx-auto transition-colors duration-300"
    >
      <h2 className="text-5xl font-bold text-center mb-5 
        bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent
        dark:from-white dark:to-white/60 pb-8">
        Everything You Need
      </h2>

      <p className="text-center text-gray-700 dark:text-white/70 text-lg mb-16">
        A complete note-taking experience powered by AI
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-10 rounded-2xl border transition-all duration-300 
              bg-white hover:bg-gray-50 border-gray-200 text-gray-900 shadow-sm
              hover:-translate-y-2 hover:shadow-md
              dark:bg-white/5 dark:border-white/10 dark:text-white
              dark:hover:shadow-lg dark:hover:border-white/20"
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-2xl mb-3 font-semibold">{f.title}</h3>
            <p className="text-gray-600 dark:text-white/70 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
