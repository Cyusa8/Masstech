import { Building2, MapPin, Calendar, ArrowRight, Filter } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsResponse, companyResponse] = await Promise.all([
        fetch("/api/public/projects"),
        fetch("/api/public/company"),
      ]);

      if (!projectsResponse.ok) {
        throw new Error(`Projects API error: ${projectsResponse.status}`);
      }
      if (!companyResponse.ok) {
        throw new Error(`Company API error: ${companyResponse.status}`);
      }

      const projectsData = await projectsResponse.json();
      const companyData = await companyResponse.json();

      setProjects(projectsData);
      setCompany(companyData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const defaultProjects = [
    {
      id: "modern-residential-complex",
      title: "Modern Residential Complex",
      category: "Residential",
      location: "Kigali, Rwanda",
      year: "2024",
      description:
        "A state-of-the-art residential complex featuring 50 modern apartments with sustainable design elements and community amenities.",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "50 Apartments",
        "Community Center",
        "Green Spaces",
        "Solar Power",
      ],
    },
    {
      id: "corporate-office-building",
      title: "Corporate Office Building",
      category: "Commercial",
      location: "Kigali, Rwanda",
      year: "2023",
      description:
        "A 12-story office building designed for maximum efficiency and employee comfort, featuring modern amenities and smart building technology.",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "12 Floors",
        "Smart Building",
        "Conference Centers",
        "Parking Garage",
      ],
    },
    {
      id: "industrial-warehouse",
      title: "Industrial Warehouse",
      category: "Industrial",
      location: "Kigali, Rwanda",
      year: "2023",
      description:
        "Large-scale warehouse facility optimized for logistics and distribution, with advanced security and climate control systems.",
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      features: [
        "50,000 sqft",
        "Climate Control",
        "Loading Docks",
        "Security Systems",
      ],
    },
  ];

  const companyName = company?.company_name || "MASS Tech Ltd";

  // Get unique categories from projects
  const getCategories = () => {
    const categories = ["All"];
    const uniqueTypes = [
      ...new Set(projects.map((p) => p.project_type).filter(Boolean)),
    ];
    return categories.concat(uniqueTypes);
  };

  const categories = loading
    ? ["All", "Residential", "Commercial", "Industrial"]
    : getCategories();

  // Filter projects by category
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.project_type === selectedCategory);

  const displayProjects = loading
    ? defaultProjects
    : filteredProjects.length > 0
      ? filteredProjects
      : defaultProjects;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).getFullYear().toString();
  };

  const getMainImage = (project) => {
    if (project.image_urls && project.image_urls.length > 0) {
      return project.image_urls[0];
    }
    // Fallback images
    const fallbackImages = [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ];
    return (
      project.image ||
      fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
    );
  };

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
                <a href="/projects" className="text-blue-600 font-semibold">
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
            <p className="mt-4 text-gray-600">Loading projects...</p>
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
              <a href="/projects" className="text-blue-600 font-semibold">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Projects</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore our portfolio of successful construction and design projects
            across residential, commercial, and industrial sectors
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

      {/* Filter Section */}
      {!error && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full border border-gray-300 transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {!loading &&
              filteredProjects.length > 0 &&
              selectedCategory !== "All" && (
                <div className="text-center mt-4 text-gray-600">
                  Showing {filteredProjects.length}{" "}
                  {selectedCategory.toLowerCase()} project
                  {filteredProjects.length !== 1 ? "s" : ""}
                </div>
              )}
          </div>
        </section>
      )}

      {/* Projects Grid */}
      {!error && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {displayProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={getMainImage(project)}
                        alt={project.name || project.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {project.project_type || project.category}
                        </span>
                      </div>
                      {project.is_featured && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {project.name || project.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {project.short_description || project.description}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="mr-4">{project.location}</span>
                        {(project.completion_date || project.year) && (
                          <>
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {formatDate(project.completion_date) ||
                                project.year}
                            </span>
                          </>
                        )}
                      </div>

                      {project.features && project.features.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {project.features
                            .slice(0, 4)
                            .map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {feature}
                              </div>
                            ))}
                        </div>
                      )}

                      {project.budget_range && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <span className="text-green-800 font-medium text-sm">
                            Budget:{" "}
                          </span>
                          <span className="text-green-600 font-semibold text-sm">
                            {project.budget_range}
                          </span>
                        </div>
                      )}

                      <a
                        href={`/projects/${project.id}`}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-medium">
                  {selectedCategory === "All"
                    ? "No projects available yet"
                    : `No ${selectedCategory.toLowerCase()} projects found`}
                </p>
                <p className="text-sm">
                  Projects added in the admin panel will appear here
                </p>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all projects
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-blue-100">
              Numbers that showcase our commitment to excellence
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {projects.length || 150}+
              </div>
              <div className="text-blue-200">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-blue-200">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Team Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready for Your Project?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our growing list of satisfied clients. Let's bring your vision
            to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Your Project
            </a>
            <a
              href="/services"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Our Services
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
