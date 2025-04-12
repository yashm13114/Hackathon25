
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserRound, ChevronRight, MessageSquare, BarChart3, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";

const Index = () => {
  const [hoverGroup, setHoverGroup] = useState(false);
  const [hoverPersonal, setHoverPersonal] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 -z-10" />
        <div className="absolute inset-0 opacity-30 bg-[url('/lovable-uploads/5e81897b-ac67-4a56-b6ea-a7c1ad170c83.png')] bg-cover bg-center mix-blend-overlay -z-10" />
        
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4"
          >
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">SpeakSpace</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-12"
          >
            Enhance your discussion and interview skills through real-time collaborative practice with AI-powered feedback and structured guidance.
          </motion.p>
          
          {/* Main Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Group Discussion Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                className={`overflow-hidden h-full transition-all duration-300 ${hoverGroup ? 'shadow-lg shadow-blue-200' : 'shadow'}`}
                onMouseEnter={() => setHoverGroup(true)}
                onMouseLeave={() => setHoverGroup(false)}
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-blue-600" />
                <CardHeader className="pb-3">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-900">Group Discussion</CardTitle>
                  <CardDescription className="text-gray-600">Collaborate and improve together</CardDescription>
                </CardHeader>
                <CardContent className="text-left">
                  <p className="text-gray-600">
                    Practice group discussions with peers, receive real-time feedback, 
                    and improve your communication skills in a collaborative environment.
                    Master the art of speaking effectively in group settings.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    size="lg" 
                    className={`w-full transition-all bg-gradient-to-r ${hoverGroup ? 'from-blue-500 to-blue-700' : 'from-blue-400 to-blue-600'}`}
                  >
                    Join Session
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Personal Interview Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                className={`overflow-hidden h-full transition-all duration-300 ${hoverPersonal ? 'shadow-lg shadow-purple-200' : 'shadow'}`}
                onMouseEnter={() => setHoverPersonal(true)}
                onMouseLeave={() => setHoverPersonal(false)}
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 to-pink-500" />
                <CardHeader className="pb-3">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <UserRound className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl text-purple-900">Personal Interview</CardTitle>
                  <CardDescription className="text-gray-600">One-on-one practice sessions</CardDescription>
                </CardHeader>
                <CardContent className="text-left">
                  <p className="text-gray-600">
                    Prepare for interviews with mock sessions, get structured feedback, 
                    and track your progress with detailed performance analytics.
                    Build confidence for your upcoming interviews.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    size="lg" 
                    className={`w-full transition-all bg-gradient-to-r ${hoverPersonal ? 'from-purple-500 to-pink-600' : 'from-purple-400 to-pink-500'}`}
                  >
                    Join Session
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SpeakSpace?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our platform offers everything you need to master communication skills</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<MessageSquare className="h-10 w-10 text-blue-600" />}
              title="AI-Powered Feedback"
              description="Get instant, intelligent feedback on your speaking style, pacing, clarity, and content relevance."
            />
            
            <FeatureCard 
              icon={<BarChart3 className="h-10 w-10 text-purple-600" />}
              title="Performance Analytics"
              description="Track your progress over time with detailed metrics and visualizations of your improvement."
            />
            
            <FeatureCard 
              icon={<BookOpen className="h-10 w-10 text-green-600" />}
              title="Practice Resources"
              description="Access a library of discussion topics, interview questions, and preparation materials."
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Hear from our users who improved their communication skills</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard 
              quote="SpeakSpace helped me land my dream job! The mock interviews gave me the confidence I needed."
              author="Alex Chen"
              role="Software Engineer"
            />
            
            <TestimonialCard 
              quote="I used to dread group discussions, but after practicing here, I'm now leading them at work."
              author="Sarah Johnson"
              role="Project Manager"
            />
            
            <TestimonialCard 
              quote="The real-time feedback is invaluable. It's like having a personal speaking coach available 24/7."
              author="Michael Rodriguez"
              role="Graduate Student"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to improve your communication skills?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">Join thousands of users who have transformed their speaking abilities</p>
          <Button size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
            Get Started For Free
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
