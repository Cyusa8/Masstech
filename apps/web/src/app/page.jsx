import { Building2, Users, Award, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesResponse, companyResponse] = await Promise.all([
        fetch("/api/public/services"),
        fetch("/api/public/company"),
      ]);

      if (!servicesResponse.ok) {
        throw new Error(`Services API error: ${servicesResponse.status}`);
      }
      if (!companyResponse.ok) {
        throw new Error(`Company API error: ${companyResponse.status}`);
      }

      const servicesData = await servicesResponse.json();
      const companyData = await companyResponse.json();

      setServices(servicesData);
      setCompany(companyData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  // Default services for fallback
  const defaultServices = [
    {
      icon: Building2,
      title: "Construction",
      description:
        "Complete construction services for residential, commercial, and industrial projects with focus on quality and innovation.",
    },
    {
      icon: Users,
      title: "Architecture",
      description:
        "Creative architectural design solutions that blend functionality with aesthetic appeal for all project types.",
    },
    {
      icon: Award,
      title: "Interior Design",
      description:
        "Transform your spaces with our expert interior design services, creating environments that inspire and function.",
    },
    {
      icon: Clock,
      title: "Project Management",
      description:
        "End-to-end project management ensuring timely delivery, budget control, and quality assurance throughout.",
    },
  ];

  // Map icon names to actual icon components
  const getIconComponent = (iconName) => {
    const iconMap = {
      Building2: Building2,
      Users: Users,
      Award: Award,
      Clock: Clock,
      building: Building2,
      users: Users,
      award: Award,
      clock: Clock,
    };
    return iconMap[iconName] || Building2;
  };

  const displayServices = loading
    ? defaultServices
    : services.length > 0
      ? services.slice(0, 4)
      : defaultServices;
  const companyName = company?.company_name || "MASS Tech Ltd";
  const tagline = company?.tagline || "Building Excellence in Rwanda";
  const description =
    company?.description ||
    "Premier construction company offering top-notch services in construction, architecture, interior design, and project management";

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <a href="/" className="flex items-center space-x-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {companyName}
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
                <a
                  href="/contact"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
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

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                {companyName}
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
              <a
                href="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
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
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        {company?.hero_image_url && (
          <div className="absolute inset-0">
            <img
              src={company.hero_image_url}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900 opacity-80"></div>
          </div>
        )}
        {!company?.hero_image_url && (
          <div className="absolute inset-0 bg-black opacity-20"></div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{tagline}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/projects"
                className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                View Our Projects
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors text-center"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for all your construction and design needs
            </p>
          </div>

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayServices.map((service, index) => {
                  const IconComponent = service.icon_name
                    ? getIconComponent(service.icon_name)
                    : service.icon;
                  return (
                    <div
                      key={service.id || index}
                      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <IconComponent className="h-12 w-12 text-blue-600 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {service.name || service.title}
                      </h3>
                      <p className="text-gray-600">
                        {service.short_description || service.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {services.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No services available yet</p>
                  <p className="text-sm">
                    Services added in the admin panel will appear here
                  </p>
                </div>
              )}

              <div className="text-center mt-12">
                <a
                  href="/services"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  Learn More About Our Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's transform your vision into reality. Contact us today for a
            consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get a Quote
            </a>
            <a
              href="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              Learn About Us
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
                <span className="text-2xl font-bold">{companyName}</span>
              </div>
              <p className="text-gray-400 mb-4">{description}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                {displayServices.slice(0, 4).map((service, index) => (
                  <li key={service.id || index}>
                    <a
                      href="/services"
                      className="hover:text-white transition-colors"
                    >
                      {service.name || service.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{company?.address || "Kigali, Rwanda"}</li>
                <li>{company?.phone || "+250 XXX XXX XXX"}</li>
                <li>{company?.email || "info@masstech.rw"}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {companyName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
