import {
  Building2,
  Users,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ServicesPage() {
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

  const defaultServices = [
    {
      icon: Building2,
      title: "Construction",
      description:
        "Complete construction services for residential, commercial, and industrial projects with focus on quality and innovation.",
      features: [
        "Residential construction",
        "Commercial buildings",
        "Industrial facilities",
        "Renovation and remodeling",
        "Quality materials and craftsmanship",
        "Sustainable building practices",
      ],
    },
    {
      icon: Users,
      title: "Architecture",
      description:
        "Creative architectural design solutions that blend functionality with aesthetic appeal for all project types.",
      features: [
        "Custom home design",
        "Commercial architecture",
        "Space planning",
        "3D visualization",
        "Building permits and approvals",
        "Sustainable design solutions",
      ],
    },
    {
      icon: Award,
      title: "Interior Design",
      description:
        "Transform your spaces with our expert interior design services, creating environments that inspire and function.",
      features: [
        "Space optimization",
        "Color and material selection",
        "Furniture and fixture planning",
        "Lighting design",
        "Custom millwork",
        "Project styling and coordination",
      ],
    },
    {
      icon: Clock,
      title: "Project Management",
      description:
        "End-to-end project management ensuring timely delivery, budget control, and quality assurance throughout.",
      features: [
        "Project planning and scheduling",
        "Budget management",
        "Quality control and assurance",
        "Vendor and subcontractor coordination",
        "Progress monitoring and reporting",
        "Risk management and mitigation",
      ],
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
      ? services
      : defaultServices;
  const companyName = company?.company_name || "MASS Tech Ltd";

  const process = [
    {
      step: "01",
      title: "Consultation",
      description:
        "Initial meeting to understand your vision, requirements, and budget",
    },
    {
      step: "02",
      title: "Planning & Design",
      description:
        "Detailed planning, architectural design, and project timeline development",
    },
    {
      step: "03",
      title: "Approval & Permits",
      description:
        "Securing necessary permits and approvals from relevant authorities",
    },
    {
      step: "04",
      title: "Construction",
      description:
        "Professional construction with regular quality checks and progress updates",
    },
    {
      step: "05",
      title: "Completion",
      description:
        "Final inspection, handover, and ongoing support for your project",
    },
  ];

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
                <a href="/services" className="text-blue-600 font-semibold">
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
            <p className="mt-4 text-gray-600">Loading services...</p>
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
              <a href="/services" className="text-blue-600 font-semibold">
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
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Comprehensive construction and design solutions tailored to meet
            your unique needs and exceed your expectations
          </p>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </section>
      )}

      {/* Detailed Services */}
      {!error && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {displayServices.length > 0 ? (
              <div className="space-y-20">
                {displayServices.map((service, index) => {
                  const IconComponent = service.icon_name
                    ? getIconComponent(service.icon_name)
                    : service.icon;
                  const features =
                    service.features && service.features.length > 0
                      ? service.features
                      : defaultServices[index]?.features || [];

                  return (
                    <div
                      key={service.id || index}
                      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
                    >
                      <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                        <div className="flex items-center mb-6">
                          <IconComponent className="h-12 w-12 text-blue-600 mr-4" />
                          <h2 className="text-3xl font-bold text-gray-900">
                            {service.name || service.title}
                          </h2>
                        </div>
                        <p className="text-lg text-gray-600 mb-8">
                          {service.description}
                        </p>
                        {service.price_range && (
                          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <span className="text-blue-800 font-medium">
                              Price Range:{" "}
                            </span>
                            <span className="text-blue-600 font-semibold">
                              {service.price_range}
                            </span>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center"
                            >
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div
                        className={
                          index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                        }
                      >
                        <img
                          src={
                            service.image_url ||
                            `https://images.unsplash.com/photo-${index === 0 ? "1504307651254-35680f356dfd" : index === 1 ? "1503387762-592deb58ef4e" : index === 2 ? "1586023492675-c4b71d7c3b14" : "1454165804606-c3d57bc86b40"}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
                          }
                          alt={service.name || service.title}
                          className="rounded-lg shadow-lg w-full h-80 object-cover"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-medium">No services available yet</p>
                <p className="text-sm">
                  Services added in the admin panel will appear here
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A streamlined approach that ensures quality results and client
              satisfaction from start to finish
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss your vision and create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get a Free Quote
            </a>
            <a
              href="/projects"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              View Our Projects
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
              <p className="text-gray-400 mb-4">
                {company?.description ||
                  "Building Excellence in Rwanda. Premier construction company specializing in residential, commercial, and industrial projects with focus on quality, sustainability, and innovation."}
              </p>
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
