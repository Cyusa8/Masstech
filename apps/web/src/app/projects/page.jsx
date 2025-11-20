import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  Home as HomeIcon,
  Factory,
  CheckCircle,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Filter,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch projects
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects", selectedCategory],
    queryFn: async () => {
      const url =
        selectedCategory === "all"
          ? "/api/projects"
          : `/api/projects?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

  const projects = projectsData?.data || [];

  const categories = [
    { id: "all", name: "All Projects", icon: Building2 },
    { id: "residential", name: "Residential", icon: HomeIcon },
    { id: "commercial", name: "Commercial", icon: Building2 },
    { id: "industrial", name: "Industrial", icon: Factory },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Our <span className="text-blue-200">Projects</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
            Explore our portfolio of successful construction projects across
            residential, commercial, and industrial sectors in Rwanda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center space-x-2 bg-white text-[#006DFF] font-semibold text-base px-8 py-4 rounded-full hover:bg-gray-50 active:scale-95 transition-all duration-150"
            >
              <span>Start Your Project</span>
              <ArrowRight size={18} />
            </a>
            <a
              href="/services"
              className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-opacity-20 active:scale-95 transition-all duration-150"
            >
              <span>Our Services</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Project Categories Filter */}
      <section className="w-full bg-white dark:bg-[#121212] py-8 md:py-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#006DFF] text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1E1E1E] rounded-3xl overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                No projects found for the selected category.
              </div>
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-[#006DFF] font-medium hover:underline"
              >
                View all projects
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#333333] rounded-3xl overflow-hidden hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/projects/${project.id}`)
                  }
                >
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        project.images?.[0] ||
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#006DFF] text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${
                          project.status === "completed"
                            ? "bg-green-500"
                            : project.status === "in_progress"
                              ? "bg-orange-500"
                              : "bg-gray-500"
                        }`}
                      >
                        {project.status === "in_progress"
                          ? "In Progress"
                          : project.status === "completed"
                            ? "Completed"
                            : project.status}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-[#111] dark:text-white mb-3">
                      {project.title}
                    </h3>

                    {/* Project Description */}
                    <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed mb-4 line-clamp-2">
                      {project.short_description || project.description}
                    </p>

                    {/* Project Details */}
                    <div className="space-y-2 mb-6">
                      {project.location && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin
                            size={16}
                            className="text-[#006DFF] flex-shrink-0"
                          />
                          <span className="text-[#6B7280] dark:text-[#A3A3A3]">
                            {project.location}
                          </span>
                        </div>
                      )}
                      {project.client && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Users
                            size={16}
                            className="text-[#006DFF] flex-shrink-0"
                          />
                          <span className="text-[#6B7280] dark:text-[#A3A3A3]">
                            {project.client}
                          </span>
                        </div>
                      )}
                      {project.project_value && (
                        <div className="flex items-center space-x-2 text-sm">
                          <DollarSign
                            size={16}
                            className="text-[#006DFF] flex-shrink-0"
                          />
                          <span className="text-[#6B7280] dark:text-[#A3A3A3]">
                            {project.project_value}
                          </span>
                        </div>
                      )}
                      {project.completion_date && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar
                            size={16}
                            className="text-[#006DFF] flex-shrink-0"
                          />
                          <span className="text-[#6B7280] dark:text-[#A3A3A3]">
                            {new Date(
                              project.completion_date,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Key Features */}
                    {project.features && project.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-[#111] dark:text-white mb-3">
                          Key Features:
                        </h4>
                        <div className="space-y-2">
                          {project.features
                            .slice(0, 3)
                            .map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <CheckCircle
                                  size={14}
                                  className="text-[#006DFF] flex-shrink-0"
                                />
                                <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                                  {feature}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* View Details Link */}
                    <a
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center space-x-2 text-[#006DFF] font-medium hover:text-[#0056d6] transition-colors group"
                    >
                      <span>View Details</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-6">
              Our Project Success
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
              Numbers speak louder than words. Here's what we've achieved in the
              construction industry.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 size={28} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-[#111] dark:text-white mb-2">
                {projects.filter((p) => p.status === "completed").length}+
              </div>
              <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                Completed Projects
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-[#111] dark:text-white mb-2">
                120+
              </div>
              <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                Happy Clients
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={28} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-[#111] dark:text-white mb-2">
                10+
              </div>
              <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                Years Experience
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-[#111] dark:text-white mb-2">
                100%
              </div>
              <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                Quality Guaranteed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Dream Project?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Let us bring your vision to life with our expertise and commitment
            to excellence in construction and design.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center space-x-2 bg-white text-[#006DFF] font-semibold text-base px-8 py-4 rounded-full hover:bg-gray-50 active:scale-95 transition-all duration-150"
            >
              <span>Get Free Consultation</span>
              <ArrowRight size={18} />
            </a>
            <a
              href="/services"
              className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-opacity-20 active:scale-95 transition-all duration-150"
            >
              <span>Our Services</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
