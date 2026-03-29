import React from 'react'
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Users, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track stock levels, manage inventory across multiple locations, and optimize your supply chain.'
    },
    {
      icon: TrendingUp,
      title: 'Sales Tracking',
      description: 'Monitor sales performance in real-time with detailed analytics and transaction history.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Reports',
      description: 'Generate comprehensive reports on sales, inventory, and business performance metrics.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage user accounts with role-based access control and audit trails for accountability.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">InventoryPro</span>
            </div>
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="px-6 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition"
              >
                Login
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Manage Your Inventory with <span className="text-blue-600">Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A comprehensive inventory management solution designed to streamline your business operations, boost productivity, and maximize profitability.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl p-12 text-white shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg">Real-time Inventory Tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg">Detailed Sales Analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg">Automated Reporting</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg">User Role Management</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg">24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Key Features</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Everything you need to manage your inventory efficiently and make data-driven decisions
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that trust InventoryPro for their inventory management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:bg-opacity-10 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-blue-400" />
                <span className="text-white font-bold">InventoryPro</span>
              </div>
              <p className="text-sm">Professional inventory management solution for modern businesses.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Inventory Tracking</a></li>
                <li><a href="#" className="hover:text-white transition">Sales Analytics</a></li>
                <li><a href="#" className="hover:text-white transition">Reports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 InventoryPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;