export default function DemoPreview() {
  const cards = [
    { title: "Project Ideas", text: "Build a productivity app that helps teams collaborate..." },
    { title: "Meeting Notes", text: "Discussed Q4 strategy. Expand markets..." },
    { title: "Learning Resources", text: "Machine learning fundamentals..." },
    { title: "Book Summary", text: "Atomic Habits: Small changes lead to big results..." },
  ];

  return (
    <div className="mt-16 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-10 max-w-5xl shadow-xl">
      <div className="flex gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-white/30" />
        <div className="w-3 h-3 rounded-full bg-white/30" />
        <div className="w-3 h-3 rounded-full bg-white/30" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-5 bg-indigo-400/10 border border-indigo-400/20 rounded-xl hover:translate-y-[-4px] hover:border-indigo-400/50 transition"
          >
            <h4 className="text-indigo-400 font-semibold mb-2">{card.title}</h4>
            <p className="text-white/60 text-sm leading-relaxed">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
