import { Bot, Mic, Smile } from "lucide-react";

const features = [
  {
    name: "Voice-to-Text Transcription",
    description:
      "Just speak your mind. Our advanced transcription will capture every word, so you can rant freely without typing a single character.",
    icon: <Mic className="w-10 h-10 text-blue-500" />,
  },
  {
    name: "Automatic Mood Detection",
    description:
      "Gain insights into your emotional patterns. Our AI analyzes your entries to detect the underlying mood, helping you understand yourself better over time.",
    icon: <Smile className="w-10 h-10 text-green-500" />,
  },
  {
    name: "Your Personal AI Assistant",
    description:
      "Feeling stuck? Our AI assistant can offer supportive feedback, ask thoughtful questions, or help you reframe your thoughts in a constructive way.",
    icon: <Bot className="w-10 h-10 text-purple-500" />,
  },
];

export default function Features() {
  return (
    <section
      className="w-full bg-slate-50 py-20 px-6 md:px-12 lg:px-44"
      id="features"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Powerful Features to Lighten Your Load
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            Everything you need to get it all off your chest.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-6 bg-gray-100 p-4 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {feature.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
