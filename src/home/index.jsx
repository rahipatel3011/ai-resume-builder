import React from "react";
import { FileText, CheckCircle, Users } from "lucide-react";
import Header from "@/components/custom/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <Header />
      <div className="text-gray-800 py-10 bg-gray-100 ">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row items-center justify-between mx-40">
            <div className="text-center lg:text-left lg:max-w-lg">
              <h1 className="text-4xl font-bold mb-4 text-sky-600">
                AI Resume Builder
              </h1>
              <p className="text-lg mb-6 text-gray-600">
                Build professional resumes effortlessly with our AI-powered
                builder.
              </p>
              <Link to="/dashboard">
                <Button
                  variant="primary"
                  className="bg-sky-600 text-white hover:bg-sky-400"
                >
                  Get Started
                </Button>
              </Link>
            </div>
            <img
              src="/resum_icon.png"
              alt="Resume Builder"
              className="mt-8 lg:mt-0 aspect-auto h-[250px]"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="container mx-auto px-6 lg:px-20 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileText className="text-sky-500 w-8 h-8" />}
            title="Easy to Use"
            description="Our intuitive interface makes resume creation a breeze."
          />
          <FeatureCard
            icon={<CheckCircle className="text-green-500 w-8 h-8" />}
            title="AI Powered"
            description="Leverage the power of AI to create stunning resumes."
          />
          <FeatureCard
            icon={<Users className="text-yellow-500 w-8 h-8" />}
            title="Team Collaboration"
            description="Work with your team to build the perfect resume."
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-sky-600 text-white py-12">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Resume?
          </h2>
          <p className="text-lg mb-6">
            Join thousands of users who have created their resumes with us.
          </p>
          <Link to="/dashboard">
            <Button
              variant="primary"
              className="bg-white text-sky-600 hover:bg-gray-200"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-800 py-6">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <p>
            &copy; {new Date().getUTCFullYear()} AI Resume Builder. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}

export default Home;
