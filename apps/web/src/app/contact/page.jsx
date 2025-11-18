import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [services, setServices] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesResponse, companyResponse] = await Promise.all([
        fetch("/api/public/services"),
        fetch("/api/public/company"),
      ]);

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      }

      if (companyResponse.ok) {
        const companyData = await companyResponse.json();
        setCompany(companyData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: "success", message: data.message });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          service: "",
          budget: "",
          timeline: "",
          message: "",
        });
      } else {
        setSubmitStatus({ type: "error", message: data.error });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      info: "+250 XXX XXX XXX",
      description: "Call us Monday to Friday, 8AM - 6PM",
    },
    {
      icon: Mail,
      title: "Email",
      info: "info@masstech.rw",
      description: "Send us an email anytime",
    },
    {
      icon: MapPin,
      title: "Office",
      info: "Kigali, Rwanda",
      description: "Visit our main office",
    },
    {
      icon: Clock,
      title: "Business Hours",
      info: "Mon - Fri: 8AM - 6PM",
      description: "Saturday: 9AM - 2PM",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                MASS Tech Ltd
              </span>
            </a>
            <nav className="hidden md:flex space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              <a
                href="/services"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Services
              </a>
              <a
                href="/projects"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Projects
              </a>
              <a
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a href="/contact" className="text-blue-600 font-semibold">
                Contact
              </a>
            </nav>
            <a
              href="/contact"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Quote
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Ready to start your construction project? Get in touch with our
            expert team for a consultation
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <item.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-blue-600 font-medium mb-2">{item.info}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              {/* Success/Error Messages */}
              {submitStatus && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-center ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                  )}
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    placeholder="+250 XXX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interested In
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  >
                    <option value="">Select a service</option>
                    {services.length > 0
                      ? services.map((service, index) => (
                          <option
                            key={service.id || index}
                            value={service.name}
                          >
                            {service.name}
                          </option>
                        ))
                      : // Fallback options when no services are loaded
                        [
                          "Construction",
                          "Architecture",
                          "Interior Design",
                          "Project Management",
                          "Renovation",
                          "Consultation",
                        ].map((service, index) => (
                          <option key={index} value={service}>
                            {service}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Budget
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-50k">Under $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k-250k">$100,000 - $250,000</option>
                    <option value="250k-500k">$250,000 - $500,000</option>
                    <option value="500k-1m">$500,000 - $1,000,000</option>
                    <option value="over-1m">Over $1,000,000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Timeline
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  >
                    <option value="">Select timeline</option>
                    <option value="immediate">
                      Immediate (within 1 month)
                    </option>
                    <option value="3-months">Within 3 months</option>
                    <option value="6-months">Within 6 months</option>
                    <option value="12-months">Within 12 months</option>
                    <option value="planning">Just planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map and Additional Info */}
            <div>
              {/* Map Placeholder */}
              <div className="bg-gray-200 h-64 rounded-xl mb-8 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">Kigali, Rwanda</p>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Why Choose MASS Tech?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      10+ years of construction excellence in Rwanda
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      150+ successful projects completed
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Expert team of architects and engineers
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Sustainable and innovative building practices
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">
                      On-time delivery and budget management
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700">24/7 customer support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't wait to bring your construction dreams to life. Contact us
            today for a free consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+250XXXXXXX"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Call Now
            </a>
            <a
              href="/projects"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              View Our Work
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">MASS Tech Ltd</span>
              </div>
              <p className="text-gray-400 mb-4">
                Building Excellence in Rwanda. Premier construction company
                specializing in residential, commercial, and industrial projects
                with focus on quality, sustainability, and innovation.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    Construction
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    Architecture
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    Interior Design
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    Project Management
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Kigali, Rwanda</li>
                <li>+250 XXX XXX XXX</li>
                <li>info@masstech.rw</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MASS Tech Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
