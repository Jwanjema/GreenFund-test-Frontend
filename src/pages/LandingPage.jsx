import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function LandingPage() {
  const features = [
    {
      icon: "🔬",
      title: "AI-Powered Soil Diagnostics",
      description: "Leverage advanced AI to deeply analyze soil composition, nutrient levels, and potential deficiencies from simple inputs or photo uploads.",
      image: "https://images.unsplash.com/photo-1628189674068-19ed9563ecf6?auto=format&fit=crop&w=800&q=80" // Soil analysis with tablet
    },
    {
      icon: "🌦️",
      title: "Intelligent Climate Adaptation",
      description: "Receive real-time weather forecasts and tailored recommendations, enabling proactive farm management and climate resilience.",
      image: "https://images.unsplash.com/photo-1621517409241-11d21463e26b?auto=format&fit=crop&w=800&q=80" // Weather / farming connection
    },
    {
      icon: "📈",
      title: "Sustainable Yield Optimization",
      description: "Maximize your harvests while minimizing environmental impact with data-driven insights for irrigation, fertilization, and crop rotation.",
      image: "https://images.unsplash.com/photo-1577717903185-bc5b4b045199?auto=format&fit=crop&w=800&q=80" // Lush, optimized farm field
    },
    {
      icon: "💰",
      title: "Carbon Footprint Tracking",
      description: "Monitor and manage your farm's carbon emissions with integrated activity logging, contributing to a greener future.",
      image: "https://images.unsplash.com/photo-1597405260172-e16e6d5e9d9e?auto=format&fit=crop&w=800&q=80" // Hand holding sprout, symbolizing growth/sustainability
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-background text-text-primary">
      {/* Hero Section */}
      <section 
        className="relative h-[85vh] flex items-center justify-center text-center text-white p-4 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533038590840-ebc686735e07?auto=format&fit=crop&w=1920&q=80')" }} // High-quality farm field image
      >
        <div className="absolute inset-0 bg-black/70"></div> {/* Darker overlay for text readability */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight drop-shadow-lg">
            Cultivate Growth, Harvest Sustainability
          </h1>
          <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto font-light">
            GreenFund empowers Kenyan farmers with cutting-edge AI insights for enhanced productivity, optimized soil health, and a greener, more profitable future.
          </p>
          <div className="mt-12 flex justify-center space-x-6">
            <Link
              to="/register"
              className="bg-primary text-white py-4 px-10 rounded-full text-xl font-bold hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Start Your Green Journey
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white py-4 px-10 rounded-full text-xl font-bold hover:bg-white hover:text-primary transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section with Images */}
      <section className="py-24 bg-gradient-to-br from-surface to-gray-50">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            How GreenFund Transforms Your Farm
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Our intelligent platform integrates advanced technology with agricultural expertise to provide you with actionable insights and sustainable solutions.
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
                variants={itemVariants}
                whileHover={{ y: -5 }} // subtle lift on hover
              >
                <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover object-center" />
                <div className="p-8 flex flex-col flex-grow">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-text-primary mt-2">{feature.title}</h3>
                  <p className="text-md text-text-secondary mt-3 flex-grow">{feature.description}</p>
                  <Link 
                    to="/register" // You can link to a more specific page if you create one
                    className="mt-6 text-primary font-semibold hover:text-green-700 flex items-center justify-center"
                  >
                    Learn More 
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials or CTA (Optional - add later if needed) */}
      {/* <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold">What Our Farmers Say</h2>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            "GreenFund changed the way I farm. My yields are up, and my land is healthier!" - Jane Doe, Farmer
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="bg-white text-primary py-3 px-8 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
            >
              Join Our Community
            </Link>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} GreenFund. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;