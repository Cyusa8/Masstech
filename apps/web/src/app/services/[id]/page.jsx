import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  Home as HomeIcon,
  Factory,
  DraftingCompass,
  Palette,
  ClipboardList,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  Phone,
  Mail,
} from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const iconMap = {
  Home: HomeIcon,
  Building2: Building2,
  Factory: Factory,
  DraftingCompass: DraftingCompass,
  Palette: Palette,
  ClipboardList: ClipboardList,
};

export default function ServiceDetailPage({ params }) {
  const serviceId = params?.id;

  // Fetch service details
  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: async () => {
      const response = await fetch(`/api/services/${serviceId}`);
      if (!response.ok) throw new Error("Failed to fetch service");
      return response.json();
    },
  });

  // Fetch related projects
  const { data: projectsData } = useQuery({
    queryKey: ["projects", "related", serviceId],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

  // Fetch related services
  const { data: relatedServicesData } = useQuery({
    queryKey: ["services", "related"],
    queryFn: async () => {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!serviceData?.success) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Service Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The service you're looking for doesn't exist.
          </p>
          <a
            href="/services"
            className="inline-flex items-center space-x-2 bg-[#006DFF] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#0056d6] transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Services</span>
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  const service = serviceData.data;
  const IconComponent = iconMap[service.icon] || Building2;
  const relatedProjects = projectsData?.data?.slice(0, 3) || [];
  const relatedServices =
    relatedServicesData?.data?.filter((s) => s.id !== service.id).slice(0, 3) ||
    [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />

      {/* Breadcrumb */}
      <section className="w-full bg-gray-50 dark:bg-[#1A1A1A] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-[#006DFF] hover:underline">
              Home
            </a>
            <span className="text-gray-500">/</span>
            <a href="/services" className="text-[#006DFF] hover:underline">
              Services
            </a>
            <span className="text-gray-500">/</span>
            <span className="text-gray-700 dark:text-gray-300">
              {service.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Service Hero */}
      <section className="w-full bg-white dark:bg-[#121212] py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center">
                  <IconComponent size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white">
                    {service.title}
                  </h1>
                  <p className="text-[#006DFF] font-medium capitalize">
                    {service.category} Service
                  </p>
                </div>
              </div>

              <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed mb-8">
                {service.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {service.price_range && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                      <DollarSign size={20} className="text-[#006DFF]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                        Price Range
                      </div>
                      <div className="font-semibold text-[#111] dark:text-white">
                        {service.price_range}
                      </div>
                    </div>
                  </div>
                )}

                {service.duration && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                      <Clock size={20} className="text-[#006DFF]" />
                    </div>
                    <div>
                      <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                        Duration
                      </div>
                      <div className="font-semibold text-[#111] dark:text-white">
                        {service.duration}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] text-white font-semibold px-6 py-3 rounded-full hover:brightness-105 active:scale-95 transition-all duration-150"
                >
                  <span>Get Quote</span>
                  <ArrowRight size={18} />
                </a>
                <a
                  href="tel:+250788123456"
                  className="inline-flex items-center space-x-2 border border-[#006DFF] text-[#006DFF] font-semibold px-6 py-3 rounded-full hover:bg-[#006DFF] hover:text-white active:scale-95 transition-all duration-150"
                >
                  <Phone size={18} />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            <div className="relative">
              {service.image_url && (
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Service Features */}
      {service.features && service.features.length > 0 && (
        <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-4">
                What's Included
              </h2>
              <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
                Our comprehensive {service.title.toLowerCase()} service includes
                everything you need for a successful project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span className="text-[#111] dark:text-white font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Process */}
      {service.process && service.process.length > 0 && (
        <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-4">
                Our Process
              </h2>
              <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
                We follow a structured approach to ensure your project is
                completed successfully.
              </p>
            </div>

            <div className="relative">
              {/* Process Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {service.process.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#111] dark:text-white mb-2">
                        {step}
                      </h3>
                    </div>

                    {/* Connecting Line */}
                    {index < service.process.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#006DFF] to-transparent transform -translate-x-8"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Service Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-4">
                Key Benefits
              </h2>
              <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
                Why choose our {service.title.toLowerCase()} service for your
                next project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 text-center hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111] dark:text-white mb-2">
                    {benefit}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-4">
                Related Projects
              </h2>
              <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
                See examples of our {service.title.toLowerCase()} work in
                action.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-[#1E1E1E] rounded-3xl overflow-hidden shadow-md hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/projects/${project.id}`)
                  }
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        project.images?.[0] ||
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#006DFF] text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#111] dark:text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm mb-4">
                      {project.location} • {project.project_value}
                    </p>
                    <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                      {project.short_description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="/projects"
                className="inline-flex items-center space-x-2 text-[#006DFF] font-medium hover:text-[#0056d6] transition-colors"
              >
                <span>View All Projects</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Contact us today to discuss your {service.title.toLowerCase()}{" "}
            requirements and get a free consultation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center space-x-2 bg-white text-[#006DFF] font-semibold text-base px-8 py-4 rounded-full hover:bg-gray-50 active:scale-95 transition-all duration-150"
            >
              <span>Get Free Quote</span>
              <ArrowRight size={18} />
            </a>
            <a
              href="tel:+250788123456"
              className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-opacity-20 active:scale-95 transition-all duration-150"
            >
              <Phone size={18} />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-4">
                Other Services
              </h2>
              <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
                Explore our other construction and design services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map((relatedService) => {
                const RelatedIconComponent =
                  iconMap[relatedService.icon] || Building2;

                return (
                  <div
                    key={relatedService.id}
                    className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#333333] rounded-3xl p-6 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200 group cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/services/${relatedService.id}`)
                    }
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                      <RelatedIconComponent size={24} className="text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-[#111] dark:text-white mb-4">
                      {relatedService.title}
                    </h3>

                    <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed mb-6 line-clamp-3">
                      {relatedService.short_description}
                    </p>

                    <a
                      href={`/services/${relatedService.id}`}
                      className="inline-flex items-center space-x-2 text-[#006DFF] font-medium hover:text-[#0056d6] transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight size={16} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
