import { Paintbrush, Wand2, Zap, Cloud } from "lucide-react";

const features = [
  {
    icon: Paintbrush,
    title: "Intuitive Design Tools",
    description: "Create stunning designs with our easy-to-use interface and powerful features.",
  },
  {
    icon: Wand2,
    title: "AI-Powered Magic",
    description: "Let our AI assist you in creating the perfect designs in seconds.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience seamless performance with our optimized platform.",
  },
  {
    icon: Cloud,
    title: "Cloud Storage",
    description: "Access your designs anywhere with secure cloud storage.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Amazing Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};