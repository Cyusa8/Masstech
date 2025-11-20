import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Home as HomeIcon,
  Factory,
  CheckCircle,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Target,
  Lightbulb,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function ProjectDetailPage({ params }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch project details
  const { data: projectData, isLoading } = useQuery({
    queryKey: ["project", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  // Fetch related projects
  const { data: relatedProjectsData } = useQuery({
    queryKey: ["projects", "related", projectData?.data?.category],
    queryFn: async () => {
      if (!projectData?.data?.category) return { data: [] };
      const response = await fetch(
        `/api/projects?category=${projectData.data.category}`,
      );
      if (!response.ok) throw new Error("Failed to fetch related projects");
      return response.json();
    },
    enabled: !!projectData?.data?.category,
  });

  const project = projectData?.data;
  const relatedProjects = (relatedProjectsData?.data || [])
    .filter((p) => p.id !== project?.id)
    .slice(0, 3);

  const nextImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + project.images.length) % project.images.length,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-1/2"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              </div>
              <div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#111] dark:text-white mb-4">
              Project Not Found
            </h1>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] mb-8">
              The project you're looking for doesn't exist.
            </p>
            <a
              href="/projects"
              className="inline-flex items-center space-x-2 bg-[#006DFF] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#0056d6] transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Projects</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const projectImages = project.images || [];
  const defaultImage =
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />

      {/* Breadcrumb */}
      <section className="w-full bg-gray-50 dark:bg-[#1A1A1A] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <a
              href="/"
              className="text-[#006DFF] hover:text-[#0056d6] transition-colors"
            >
              Home
            </a>
            <span className="text-[#6B7280] dark:text-[#A3A3A3]">/</span>
            <a
              href="/projects"
              className="text-[#006DFF] hover:text-[#0056d6] transition-colors"
            >
              Projects
            </a>
            <span className="text-[#6B7280] dark:text-[#A3A3A3]">/</span>
            <span className="text-[#6B7280] dark:text-[#A3A3A3]">
              {project.title}
            </span>
          </div>
        </div>
      </section>

      {/* Project Header */}
      <section className="w-full bg-white dark:bg-[#121212] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-[#006DFF] text-white text-sm font-semibold px-4 py-2 rounded-full capitalize">
                {project.category}
              </span>
              <span
                className={`text-white text-sm font-semibold px-4 py-2 rounded-full ${
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

            <h1 className="text-4xl md:text-5xl font-bold text-[#111] dark:text-white mb-4">
              {project.title}
            </h1>

            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] mb-6 max-w-3xl">
              {project.short_description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {project.location && (
                <div className="flex items-center space-x-2">
                  <MapPin size={18} className="text-[#006DFF]" />
                  <div>
                    <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                      Location
                    </div>
                    <div className="font-medium text-[#111] dark:text-white">
                      {project.location}
                    </div>
                  </div>
                </div>
              )}

              {project.client && (
                <div className="flex items-center space-x-2">
                  <Users size={18} className="text-[#006DFF]" />
                  <div>
                    <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                      Client
                    </div>
                    <div className="font-medium text-[#111] dark:text-white">
                      {project.client}
                    </div>
                  </div>
                </div>
              )}

              {project.project_value && (
                <div className="flex items-center space-x-2">
                  <DollarSign size={18} className="text-[#006DFF]" />
                  <div>
                    <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                      Project Value
                    </div>
                    <div className="font-medium text-[#111] dark:text-white">
                      {project.project_value}
                    </div>
                  </div>
                </div>
              )}

              {project.completion_date && (
                <div className="flex items-center space-x-2">
                  <Calendar size={18} className="text-[#006DFF]" />
                  <div>
                    <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                      Completed
                    </div>
                    <div className="font-medium text-[#111] dark:text-white">
                      {new Date(project.completion_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      {projectImages.length > 0 && (
        <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden">
                <img
                  src={projectImages[currentImageIndex] || defaultImage}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {projectImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-[#111] dark:text-white p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-[#111] dark:text-white p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {projectImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {projectImages.length > 1 && (
                <div className="mt-6 grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {projectImages.slice(0, 10).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-[#006DFF] ring-2 ring-blue-200"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${project.title} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Project Details */}
      <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[#111] dark:text-white mb-6">
                  Project Overview
                </h2>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed text-lg">
                  {project.description}
                </p>
              </div>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#111] dark:text-white mb-6">
                    Key Features
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl"
                      >
                        <CheckCircle
                          size={20}
                          className="text-[#006DFF] flex-shrink-0 mt-0.5"
                        />
                        <span className="text-[#111] dark:text-white font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {project.challenges && (
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <Target size={24} className="text-orange-500" />
                        <h3 className="text-xl font-bold text-[#111] dark:text-white">
                          Challenges
                        </h3>
                      </div>
                      <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                        {project.challenges}
                      </p>
                    </div>
                  )}

                  {project.solutions && (
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <Lightbulb size={24} className="text-green-500" />
                        <h3 className="text-xl font-bold text-[#111] dark:text-white">
                          Solutions
                        </h3>
                      </div>
                      <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                        {project.solutions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#F8FAFC] dark:bg-[#1A1A1A] rounded-3xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-[#111] dark:text-white mb-6">
                  Project Information
                </h3>

                <div className="space-y-6">
                  {project.duration && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock size={18} className="text-[#006DFF]" />
                        <span className="font-medium text-[#111] dark:text-white">
                          Duration
                        </span>
                      </div>
                      <p className="text-[#6B7280] dark:text-[#A3A3A3] ml-6">
                        {project.duration}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="font-medium text-[#111] dark:text-white mb-4">
                      Interested in a similar project?
                    </h4>
                    <a
                      href="/contact"
                      className="inline-flex items-center space-x-2 bg-[#006DFF] text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#0056d6] active:scale-95 transition-all duration-150 w-full justify-center"
                    >
                      <span>Get Quote</span>
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-4">
                Related Projects
              </h2>
              <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3]">
                Explore more projects in the {project.category} category
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((relatedProject) => (
                <div
                  key={relatedProject.id}
                  className="bg-white dark:bg-[#1E1E1E] rounded-3xl overflow-hidden hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/projects/${relatedProject.id}`)
                  }
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        relatedProject.images?.[0] ||
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={relatedProject.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#111] dark:text-white mb-2">
                      {relatedProject.title}
                    </h3>
                    <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm mb-4">
                      {relatedProject.location} • {relatedProject.project_value}
                    </p>
                    <a
                      href={`/projects/${relatedProject.id}`}
                      className="inline-flex items-center space-x-2 text-[#006DFF] font-medium hover:text-[#0056d6] transition-colors"
                    >
                      <span>View Project</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="/projects"
                className="inline-flex items-center space-x-2 bg-[#006DFF] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#0056d6] active:scale-95 transition-all duration-150"
              >
                <span>View All Projects</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
