import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Send, Package } from 'lucide-react';
import { toast } from 'sonner';
import { sendContactMessage } from '../api/contactServices';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendContactMessage(formData);
      if (response.success) {
        toast.success(response.message);
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = '+250 780 407 093'; // Replace with your WhatsApp number
  const whatsappURL = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AIDO Group Company Ltd</span>
            </Link>
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="px-6 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition"
              >
                Login
              </Link>
              <Link 
                to="/" 
                className="px-6 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch With Us</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Have questions about AIDO Group Company Limited? We're here to help! Reach out through any of our communication channels.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600 mb-4">Call us during business hours</p>
            <a href="tel:+250780407093" className="text-blue-600 font-semibold hover:text-blue-700">
              +250 780 407 093
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 mb-4">Send us an email anytime</p>
            <a href="mailto:contact@inventorypro.com" className="text-blue-600 font-semibold hover:text-blue-700">
              contact@inventorypro.com
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600">
              Kabuga<br />
              Near Kabuga Market<br />
              About to reach Gasasa center
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Sending...</>
                ) : (
                  <><Send className="w-5 h-5" /> Send Message</>
                )}
              </button>
            </form>
          </div>

          {/* WhatsApp & Support Info */}
          <div className="space-y-6">
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">WhatsApp Chat</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Get instant support via WhatsApp. We typically respond within 2 hours during business hours.
              </p>
              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-semibold text-gray-900">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-semibold text-gray-900">Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Response Time</h3>
              <p className="text-gray-600">
                We aim to respond to all inquiries within 24 hours on weekdays. Thank you for your patience!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 InventoryPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;