import { useState } from 'react';
import { FaHome, FaSearch, FaHandshake, FaShieldAlt, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { LOGIN_ROUTE, PUBLIC_PROPERTIES_ROUTE } from '../router';
import Logo from '../assets/logo/logoo.png';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I list my property?",
      answer: "You can list your property by creating an account, going to your dashboard, and clicking on 'Add New Property'. Fill in the required details and submit for review."
    },
    {
      question: "What are the fees for listing a property?",
      answer: "We offer competitive rates for property listings. Basic listings are free, while premium listings with additional features are available at a small fee."
    },
    {
      question: "How do I schedule a viewing?",
      answer: "You can schedule a viewing directly through the property listing page. Click on 'Schedule Viewing' and select your preferred date and time."
    },
    {
      question: "Can I search for properties in specific neighborhoods?",
      answer: "Yes, our search filter allows you to narrow down your search by city and can be enhanced to include neighborhood filtering as well."
    },
    {
      question: "How accurate is the property information?",
      answer: "We strive for accuracy by verifying listings. However, we recommend contacting the agent or owner to confirm details."
    },
    {
      question: "How can I contact a property agent?",
      answer: "Each property listing includes contact information for the agent or owner. You can reach out to them directly through the provided details."
    },
    {
      question: "What is the process for renting a property?",
      answer: "The rental process typically involves viewing the property, submitting an application, signing a lease agreement, and paying a security deposit and first month's rent."
    }
  ];

  const featuredProperties = [
    {
      id: 1,
      title: "Modern Apartment in City Center",
      price: "$250,000",
      location: "Downtown",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      beds: 2,
      baths: 1,
      area: '850 sqft'
    },
    {
      id: 2,
      title: "Luxury Villa with Pool",
      price: "$500,000",
      location: "Suburbs",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      beds: 4,
      baths: 3,
      area: '2500 sqft'
    },
    {
      id: 3,
      title: "Cozy Studio Apartment",
      price: "$150,000",
      location: "University District",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      beds: 1,
      baths: 1,
      area: '450 sqft'
    }
  ];

  const moroccanCities = ["Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Essaouira", "Meknes", "Oujda", "Kenitra"]; // Added more cities

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Modern Client-Style Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <img src={Logo} alt="Logo" className="w-14 h-14 object-contain rounded-full" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary-modern">Bab-Immobilier</h1>
                <p className="text-xs text-muted-foreground">Your Dream Home Awaits</p>
              </div>
            </div>
            {/* Navigation Actions */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="text-primary-modern hover:underline font-semibold px-3 py-2 rounded transition-colors">Home</Link>
              <Link to="/public-properties" className="text-primary-modern hover:underline font-semibold px-3 py-2 rounded transition-colors">Properties</Link>
              <Button
                onClick={() => navigate('/login')}
                className="bg-primary-modern text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section 
        className="relative h-[600px] bg-cover bg-center text-white w-full flex items-center justify-center mt-0 pt-0"
        style={{ backgroundImage: `url('/images/backimg.jpg')` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div> {/* Darker overlay */}
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg text-white">Find Your Dream Home</h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-lg text-white">Discover the perfect property that matches your lifestyle and preferences.</p>

          {/* Search Filter */}
          <div className="w-full max-w-4xl bg-card text-card-foreground p-6 rounded-lg shadow-xl mt-4 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input 
                type="text"
                placeholder="Suggested Searches (e.g., Villa with pool)"
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-modern bg-background text-foreground"
              />
              <select className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-modern bg-background text-foreground">
                <option value="">Select City</option>
                {moroccanCities.map((city) => (
                  <option key={city} value={city.toLowerCase()}>{city}</option>
                ))}
              </select>
              <select className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-modern bg-background text-foreground">
                <option value="">Property Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
              </select>
              <select className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-modern bg-background text-foreground">
                <option value="">Price Range</option>
                <option value="100000-300000">$100k - $300k</option>
                <option value="300000-600000">$300k - $600k</option>
                <option value="600000+">$600k+</option>
              </select>
            </div>
            <div className="mt-6 flex gap-4">
              <button className="flex-1 bg-primary-modern text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-modern focus:ring-offset-2 shadow flex items-center justify-center gap-2">
                Search Properties <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => navigate(PUBLIC_PROPERTIES_ROUTE)}
                className="flex-1 bg-secondary-modern text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-modern focus:ring-offset-2 shadow flex items-center justify-center gap-2"
              >
                Browse All Properties <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Property Statistics */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white drop-shadow-lg">
            <div className="text-center">
              <div className="text-4xl font-bold">5,000+</div>
              <div className="text-lg text-gray-200">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">50+</div>
              <div className="text-lg text-gray-200">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">98%</div>
              <div className="text-lg text-gray-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-primary-modern">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-card dark:bg-secondary text-card-foreground rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border group cursor-pointer">
              <FaHome className="text-4xl text-blue-500 mx-auto mb-4 drop-shadow group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Wide Selection</h3>
              <p className="text-muted-foreground">Browse through thousands of verified properties</p>
            </div>
            <div className="text-center p-6 bg-card dark:bg-secondary text-card-foreground rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border group cursor-pointer">
              <FaSearch className="text-4xl text-green-500 mx-auto mb-4 drop-shadow group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Easy Search</h3>
              <p className="text-muted-foreground">Find exactly what you're looking for with our advanced filters</p>
            </div>
            <div className="text-center p-6 bg-card dark:bg-secondary text-card-foreground rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border group cursor-pointer">
              <FaHandshake className="text-4xl text-purple-500 mx-auto mb-4 drop-shadow group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Trusted Partners</h3>
              <p className="text-muted-foreground">Work with verified real estate professionals</p>
            </div>
            <div className="text-center p-6 bg-card dark:bg-secondary text-card-foreground rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border group cursor-pointer">
              <FaShieldAlt className="text-4xl text-yellow-500 mx-auto mb-4 drop-shadow group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Secure Platform</h3>
              <p className="text-muted-foreground">Your data and transactions are always protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-primary-modern">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property.id} className="bg-card dark:bg-secondary text-card-foreground rounded-lg shadow-lg overflow-hidden border border-border hover:shadow-2xl transition-shadow duration-300 group cursor-pointer">
                <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{property.title}</h3>
                  <p className="text-primary-modern font-bold mb-2">{property.price}</p>
                  <p className="text-muted-foreground mb-4">{property.location}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4 gap-4">
                    <div className="flex items-center">
                      <FaBed className="mr-1 text-blue-500" /> {property.beds} Beds
                    </div>
                    <div className="flex items-center">
                      <FaBath className="mr-1 text-green-500" /> {property.baths} Baths
                    </div>
                    <div className="flex items-center">
                      <FaRulerCombined className="mr-1 text-purple-500" /> {property.area}
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-primary-modern hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
                    View Details <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 text-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-primary-modern">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  className="w-full text-left p-4 bg-card dark:bg-secondary text-card-foreground rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-border"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <span className="text-primary-modern">{activeFaq === index ? '−' : '+'}</span>
                  </div>
                  {activeFaq === index && (
                    <p className="mt-2 text-gray-500">{faq.answer}</p>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background text-gray-700 py-12 w-full border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">About Us</h3>
              <p>Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters with their dream homes.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary-modern">Home</a></li>
                <li><a href="#" className="hover:text-primary-modern">Properties</a></li>
                <li><a href="#" className="hover:text-primary-modern">About</a></li>
                <li><a href="#" className="hover:text-primary-modern">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Contact Us</h3>
              <ul className="space-y-2">
                <li>Email: info@realestate.com</li>
                <li>Phone: +1 234 567 890</li>
                <li>Address: 123 Real Estate St, City</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Newsletter</h3>
              <p className="mb-4">Subscribe to our newsletter for updates and offers.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-l-lg w-full text-gray-900 border border-gray-300"
                />
                <button className="bg-primary-modern text-white px-4 py-2 rounded-r-lg font-semibold hover:bg-blue-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p>&copy; 2024 Real Estate Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}