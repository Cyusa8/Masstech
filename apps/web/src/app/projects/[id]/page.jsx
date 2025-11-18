import {
  Building2,
  MapPin,
  Calendar,
  ArrowLeft,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function ProjectDetailPage({ params }) {
  const [project, setProject] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params?.id) {
      fetchData();
    }
  }, [params?.id]);

  const fetchData = async () => {
    try {
      const [projectsResponse, companyResponse] = await Promise.all([
        fetch("/api/public/projects"),
        fetch("/api/public/company"),
      ]);

      if (projectsResponse.ok) {
        const projects = await projectsResponse.json();
        const foundProject = projects.find(
          (p) => p.id.toString() === params.id,
        );
        if (foundProject) {
          setProject(foundProject);
        } else {
          setError("Project not found");
        }
      } else {
        setError("Failed to load project");
      }

      if (companyResponse.ok) {
        const companyData = await companyResponse.json();
        setCompany(companyData);
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  const companyName = company?.company_name || "MASS Tech Ltd";

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

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <a
          href="/projects"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Projects
        </a>
      </div>

      {/* Project Hero */}
      {loading ? (
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading project...</p>
          </div>
        </div>
      ) : error ? (
        <div className="h-96 bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-4">{error}</h1>
            <p className="text-red-600 mb-6">
              The project you're looking for might have been moved or removed.
            </p>
            <a
              href="/projects"
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Projects
            </a>
          </div>
        </div>
      ) : project ? (
        <section className="relative h-96 overflow-hidden">
          <img
            src={
              project.image_urls?.[0] ||
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            }
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                {project.project_type}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {project.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{project.location}</span>
                </div>
                {project.completion_date && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>
                      {new Date(project.completion_date).getFullYear()}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="capitalize">
                    {project.status?.replace("_", " ") || "Completed"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Project Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Project Overview
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {project?.description || ""}
                </p>
              </div>

              {/* Gallery */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Project Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(project?.gallery || []).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${project?.title || ""} - Image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    />
                  ))}
                </div>
              </div>

              {/* Challenges & Solutions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Challenges
                  </h3>
                  <ul className="space-y-3">
                    {(project?.challenges || []).map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-red-100 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Solutions
                  </h3>
                  <ul className="space-y-3">
                    {(project?.solutions || []).map((solution, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-500 w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Project Info */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Project Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Client:</span>
                    <span className="font-medium text-gray-900">
                      {project?.client || ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">
                      {project?.duration || ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium text-gray-900">
                      {project?.budget || ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">
                      {project?.status || ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white border p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {(project?.features || []).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Specifications
                </h3>
                <div className="space-y-3">
                  {Object.entries(project?.specifications || {}).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium text-gray-900">
                          {value}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Interested in Similar Work?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can bring your construction vision to life with
            the same level of excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Project
            </a>
            <a
              href="/projects"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
            >
              View More Projects
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
