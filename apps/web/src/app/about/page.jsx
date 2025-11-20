import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  Eye,
  Award,
  Building2,
  Calendar,
  Globe,
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AboutPage() {
  // Fetch company info
  const { data: companyData } = useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      const response = await fetch("/api/company");
      if (!response.ok) throw new Error("Failed to fetch company info");
      return response.json();
    },
  });

  // Fetch team members
  const { data: teamData } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const response = await fetch("/api/team");
      if (!response.ok) throw new Error("Failed to fetch team members");
      return response.json();
    },
  });

  const company = companyData?.data || {};
  const team = teamData?.data || [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            About <span className="text-blue-200">MASS Tech</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {company.description ||
              "Building Excellence in Rwanda since 2015. We are a premier construction company transforming visions into reality with innovation and precision."}
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                <p>
                  Founded in {company.established_year || "2015"}, MASS Tech Ltd
                  emerged from a vision to transform Rwanda's construction
                  landscape through innovation, quality, and sustainable
                  building practices. Our journey began with a small team of
                  dedicated professionals who shared a common goal: to build
                  excellence.
                </p>
                <p>
                  Over the years, we have grown into one of Rwanda's most
                  trusted construction companies, completing over{" "}
                  {company.total_projects || "150"} projects ranging from
                  residential homes to large commercial complexes. Our
                  commitment to quality and client satisfaction has earned us
                  the trust of {company.happy_clients || "120"}+ satisfied
                  clients.
                </p>
                <p>
                  Today, we continue to push the boundaries of what's possible
                  in construction, incorporating the latest technologies and
                  sustainable practices to create buildings that stand the test
                  of time.
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&w=800&q=80"
                alt="MASS Tech team at construction site"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#006DFF] text-white p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">
                  {company.years_experience || "10"}+ Years
                </div>
                <div className="text-sm opacity-90">Building Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-6">
              Our Foundation
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
              Our mission, vision, and values guide everything we do and shape
              the way we build for the future.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 text-center border border-[#E5E7EB] dark:border-[#333333]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#111] dark:text-white mb-4">
                Our Mission
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                {company.mission ||
                  "To deliver exceptional construction services that exceed client expectations while contributing to Rwanda's development through innovative and sustainable building solutions."}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 text-center border border-[#E5E7EB] dark:border-[#333333]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#111] dark:text-white mb-4">
                Our Vision
              </h3>
              <p className="text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                {company.vision ||
                  "To be the leading construction company in Rwanda, recognized for our commitment to quality, innovation, and sustainable development."}
              </p>
            </div>

            {/* Values */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 text-center border border-[#E5E7EB] dark:border-[#333333]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#111] dark:text-white mb-4">
                Our Values
              </h3>
              <div className="space-y-2">
                {(
                  company.values || [
                    "Quality",
                    "Innovation",
                    "Sustainability",
                    "Integrity",
                    "Client Focus",
                    "Excellence",
                  ]
                ).map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center space-x-2"
                  >
                    <CheckCircle
                      size={16}
                      className="text-[#006DFF] flex-shrink-0"
                    />
                    <span className="text-[#6B7280] dark:text-[#A3A3A3] text-sm">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="w-full bg-white dark:bg-[#121212] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-6">
              Our Achievements
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence and client
              satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} className="text-white" />
              </div>
              <div className="text-4xl font-bold text-[#111] dark:text-white mb-2">
                {company.years_experience || "10"}+
              </div>
              <div className="text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                Years of Experience
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} className="text-white" />
              </div>
              <div className="text-4xl font-bold text-[#111] dark:text-white mb-2">
                {company.total_projects || "150"}+
              </div>
              <div className="text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                Projects Completed
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-white" />
              </div>
              <div className="text-4xl font-bold text-[#111] dark:text-white mb-2">
                {company.happy_clients || "120"}+
              </div>
              <div className="text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                Satisfied Clients
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe size={32} className="text-white" />
              </div>
              <div className="text-4xl font-bold text-[#111] dark:text-white mb-2">
                5
              </div>
              <div className="text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                Provinces Served
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full bg-[#F8FAFC] dark:bg-[#1A1A1A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] dark:text-white mb-6">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
              Our team of experienced professionals brings expertise,
              innovation, and dedication to every project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.id}
                className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 text-center border border-[#E5E7EB] dark:border-[#333333] hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative inline-block mb-6">
                  <img
                    src={
                      member.image_url ||
                      `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80`
                    }
                    alt={member.name}
                    className="w-24 h-24 rounded-2xl object-cover mx-auto"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#006DFF] rounded-xl flex items-center justify-center">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#111] dark:text-white mb-2">
                  {member.name}
                </h3>

                <p className="text-[#006DFF] font-medium mb-3">
                  {member.position}
                </p>

                <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed mb-4">
                  {member.bio}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {(member.specialties || [])
                    .slice(0, 3)
                    .map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 dark:bg-blue-900/20 text-[#006DFF] text-xs px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                </div>

                {member.years_experience && (
                  <div className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                    {member.years_experience} years experience
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your Dream Project?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Let's discuss how we can bring your vision to life with our
            expertise and commitment to excellence.
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
              href="/projects"
              className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 text-white font-semibold text-base px-8 py-4 rounded-full hover:bg-opacity-20 active:scale-95 transition-all duration-150"
            >
              <span>View Our Work</span>
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
