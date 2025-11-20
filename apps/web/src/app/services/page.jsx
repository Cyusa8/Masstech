import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  Home as HomeIcon,
  Factory,
  DraftingCompass,
  Palette,
  ClipboardList,
  CheckCircle,
  Clock,
  DollarSign,
  Settings,
  Target,
  Award,
  Users,
  Zap,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const iconMap = {
  Home: HomeIcon,
  Building2: Building2,
  Factory: Factory,
  DraftingCompass: DraftingCompass,
  Palette: Palette,
  ClipboardList: ClipboardList,
};

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch services
  const { data: servicesData, isLoading } = useQuery({
    queryKey: ["services", selectedCategory],
    queryFn: async () => {
      const url =
        selectedCategory === "all"
          ? "/api/services"
          : `/api/services?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const services = servicesData?.data || [];

  const categories = [
    { id: "all", name: "All Services", icon: Building2 },
    { id: "construction", name: "Construction", icon: Building2 },
    { id: "architecture", name: "Architecture", icon: DraftingCompass },
    { id: "design", name: "Interior Design", icon: Palette },
    { id: "management", name: "Project Management", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Our <span className="text-blue-200">Services</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
            From concept to completion, we provide comprehensive construction
            and design services that transform your vision into reality with
            unmatched quality and precision.
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
              href="/projects"
              className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-opacity-20 active:scale-95 transition-all duration-150"
            >
              <span>View Our Work</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Service Categories Filter */}
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

      {/* Services Grid */}
      <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1E1E1E] rounded-3xl animate-pulse"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-3xl mb-6"></div>
                  <div className="p-8">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                No services found for the selected category.
              </div>
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-[#006DFF] font-medium hover:underline"
              >
                View all services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const IconComponent = iconMap[service.icon] || Building2;

                return (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#333333] rounded-3xl overflow-hidden hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-black/20 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/services/${service.id}`)
                    }
                  >
                    {/* Service Image */}
                    {service.image_url && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-[#006DFF] text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
                            {service.category}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6 md:p-8">
                      {/* Service Icon */}
                      <div className="w-12 h-12 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent size={24} className="text-white" />
                      </div>

                      {/* Service Title */}
                      <h3 className="text-xl font-bold text-[#111] dark:text-white mb-4 group-hover:text-[#006DFF] transition-colors">
                        {service.title}
                      </h3>

                      {/* Service Description */}
                      <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed mb-6 line-clamp-3">
                        {service.short_description || service.description}
                      </p>

                      {/* Service Info */}
                      <div className="space-y-3 mb-6">
                        {service.price_range && (
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign
                              size={16}
                              className="text-[#006DFF] flex-shrink-0"
                            />
                            <span className="text-[#6B7280] dark:text-[#A3A3A3]">
                              {service.price_range}
                            </span>
                          </div>
                        )}
                        {service.duration && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock
                              size={16}
                              className="text-[#006DFF] flex-shrink-0"
                            />
                            <span className="text-[#6B7280] dark:text-[#A3A3A3]">
                              {service.duration}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Key Features */}
                      {service.features && service.features.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-[#111] dark:text-white mb-3">
                            Key Features:
                          </h4>
                          <div className="space-y-2">
                            {service.features
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

                      {/* Learn More Link */}
                      <a
                        href={`/services/${service.id}`}
                        className="inline-flex items-center space-x-2 text-[#006DFF] font-medium hover:text-[#0056d6] transition-colors group"
                      >
                        <span>Learn More</span>
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-6">
              Why Choose Our Services?
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
              We combine expertise, innovation, and dedication to deliver
              exceptional results that exceed your expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#111] dark:text-white mb-4">
                Quality Guaranteed
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                We maintain the highest standards of quality in all our services
                with rigorous quality control and experienced professionals.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#111] dark:text-white mb-4">
                On-Time Delivery
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                We understand the importance of deadlines and consistently
                deliver projects on time and within budget.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#111] dark:text-white mb-4">
                Expert Team
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                Our team of experienced professionals brings expertise and
                innovation to every project we undertake.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <DollarSign size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#111] dark:text-white mb-4">
                Competitive Pricing
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                We offer competitive pricing without compromising on quality,
                ensuring you get the best value for your investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process Overview */}
      <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-6">
              Our Service Process
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
              From initial consultation to project completion, we follow a
              proven process that ensures exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target size={28} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#006DFF] text-white text-sm font-bold rounded-full flex items-center justify-center">
                  1
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#111] dark:text-white mb-3">
                Consultation
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3]">
                We start with understanding your needs and project requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DraftingCompass size={28} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#006DFF] text-white text-sm font-bold rounded-full flex items-center justify-center">
                  2
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#111] dark:text-white mb-3">
                Planning
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3]">
                We create detailed plans and designs tailored to your vision.
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings size={28} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#006DFF] text-white text-sm font-bold rounded-full flex items-center justify-center">
                  3
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#111] dark:text-white mb-3">
                Execution
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3]">
                Our expert team brings your project to life with precision.
              </p>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award size={28} className="text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#006DFF] text-white text-sm font-bold rounded-full flex items-center justify-center">
                  4
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#111] dark:text-white mb-3">
                Completion
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3]">
                We deliver exceptional results that exceed your expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Contact us today to discuss your requirements and get a free
            consultation for your construction or design project.
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
              href="/projects"
              className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-opacity-20 active:scale-95 transition-all duration-150"
            >
              <span>See Our Portfolio</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
