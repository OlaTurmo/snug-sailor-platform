import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "$9",
    features: ["5 Projects", "Basic Templates", "Community Support", "2GB Storage"],
  },
  {
    name: "Pro",
    price: "$19",
    features: ["Unlimited Projects", "Premium Templates", "Priority Support", "10GB Storage"],
  },
  {
    name: "Enterprise",
    price: "$49",
    features: ["Custom Solutions", "Advanced Features", "24/7 Support", "Unlimited Storage"],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border"
            >
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="text-primary w-5 h-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};