import React from 'react';
import { Link } from 'react-router-dom';
import { Package, MessageCircle, Building, Users, Star, ArrowRight, Hammer } from 'lucide-react';

const Home = () => {
  const facilities = [
    {
      image: "https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=800&auto=format&fit=crop",
      title: "Premium Lumber Yard",
      description: "High-quality timber and wood products sourced for durability and structural integrity."
    },
    {
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      title: "Steel & Metal Fabrication",
      description: "Heavy-duty steel beams, rebars, and roofing sheets for robust construction projects."
    },
    {
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
      title: "Cement & Masonry",
      description: "Top-grade cement, concrete blocks, and bricks ensuring a solid foundation."
    },
    {
      image: "https://images.unsplash.com/photo-1581166397057-235af2b3c6dd?q=80&w=800&auto=format&fit=crop",
      title: "Tools & Hardware",
      description: "A comprehensive range of professional-grade tools and essential construction hardware."
    },
    {
      image: "https://images.unsplash.com/photo-1579958371191-49666cbbdd03?q=80&w=800&auto=format&fit=crop",
      title: "Logistics & Delivery",
      description: "Our fleet of heavy machinery and trucks ready to deliver supplies directly to your site."
    },
    {
      image: "https://images.unsplash.com/photo-1504307651254-35680f356fce?q=80&w=800&auto=format&fit=crop",
      title: "Massive Warehousing",
      description: "Our large-scale warehousing ensures we always have the materials you need in stock."
    }
  ];

  const whatsappNumber = "250780407093";
  const whatsappURL = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappURL} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-8 right-8 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 flex items-center justify-center animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
      </a>

      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AIDO Group Company Ltd</span>
            </Link>
            <div className="flex gap-4 items-center">
              <Link 
                to="/login" 
                className="px-6 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition"
              >
                Staff Portal
              </Link>
              <Link 
                to="/contact" 
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541888086925-920a0b27e69b?q=80&w=2000&auto=format&fit=crop" 
            alt="AIDO Group Construction Site" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-center">
            <span className="px-4 py-1.5 bg-blue-600/30 border border-blue-400/50 text-blue-200 backdrop-blur-sm rounded-full text-sm font-medium uppercase tracking-wider flex items-center gap-2">
              <Hammer className="w-4 h-4" /> Building the Future Together
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            High-Quality <span className="text-blue-500">Building Materials</span> for Every Project
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light drop-shadow">
            From foundation to roof, AIDO Group Company Ltd provides the finest construction supplies. Take a tour of our extensive inventory and heavy-duty facilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#tour" 
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg shadow-lg"
            >
              Explore Our Materials <ArrowRight className="w-5 h-5" />
            </a>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition flex items-center justify-center text-lg shadow-lg"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Business Stats Overlay */}
      <section className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100 border border-gray-100">
          <div className="p-4">
            <Building className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-900 mb-1">Massive Stock</h3>
            <p className="text-gray-500">Thousands of materials ready</p>
          </div>
          <div className="p-4">
            <Package className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-900 mb-1">Site Delivery</h3>
            <p className="text-gray-500">We deliver directly to your site</p>
          </div>
          <div className="p-4">
            <Star className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-gray-900 mb-1">Top Quality</h3>
            <p className="text-gray-500">Certified construction products</p>
          </div>
        </div>
      </section>

      {/* Visual Tour Section */}
      <section id="tour" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Core Offerings</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Take a closer look at our vast storage facilities and the premium supplies that fuel major construction sites countrywide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden border-b-4 border-blue-500">
                  <img 
                    src={facility.image} 
                    alt={facility.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{facility.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action via WhatsApp */}
      <section className="bg-linear-to-tr from-blue-600 to-orange-700 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1541888086925-920a0b27e69b?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <MessageCircle className="w-16 h-16 text-green-400 mx-auto mb-6 drop-shadow-xl" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Need a Bulk Order Quote?</h2>
          <p className="text-xl text-orange-50 mb-10 max-w-2xl mx-auto">
            Skip the delay. Our sales team is active and ready to provide instant quotes for your construction material needs. Connect with us on WhatsApp right now.
          </p>
          <a 
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 hover:scale-105 transition-all shadow-xl text-lg border-2 border-green-400"
          >
            <MessageCircle className="w-6 h-6" /> Chat With Sales on WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-500" />
            <span className="text-white font-bold text-xl tracking-wide">AIDO Group Company Ltd</span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#tour" className="hover:text-blue-400 transition-colors">Our Materials</a>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
            <Link to="/login" className="hover:text-blue-400 transition-colors">Staff Portal</Link>
          </div>
          <p className="text-sm border-t border-slate-800 md:border-none pt-6 md:pt-0 w-full md:w-auto text-center md:text-left">
            &copy; 2026 AIDO Group Company Ltd. All rights reserved. Building materials for pros.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;