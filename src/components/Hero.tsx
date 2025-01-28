import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="pt-24 pb-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your All-in-One Design Solution
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create beautiful designs faster than ever with our intuitive tools and extensive library of resources.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6">
              Start Free Trial
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};