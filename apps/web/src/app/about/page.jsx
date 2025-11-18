import {
  Building2,
  Users,
  Award,
  Clock,
  Shield,
  Target,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamResponse, companyResponse] = await Promise.all([
        fetch("/api/public/team"),
        fetch("/api/public/company"),
      ]);

      if (!teamResponse.ok) {
        throw new Error(`Team API error: ${teamResponse.status}`);
      }
      if (!companyResponse.ok) {
        throw new Error(`Company API error: ${companyResponse.status}`);
      }

      const teamData = await teamResponse.json();
      const companyData = await companyResponse.json();

      setTeamMembers(teamData);
      setCompany(companyData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const companyName = company?.company_name || "MASS Tech Ltd";

  const values = [
    {
      icon: Award,
      title: "Quality Excellence",
      description:
        "We maintain the highest standards in every project, ensuring exceptional craftsmanship and attention to detail.",
    },
    {
      icon: Shield,
      title: "Trust & Reliability",
      description:
        "Our clients trust us to deliver on our promises, maintaining transparency and reliability throughout every project.",
    },
    {
      icon: Target,
      title: "Innovation",
      description:
        "We embrace cutting-edge technologies and sustainable practices to create forward-thinking solutions.",
    },
    {
      icon: Heart,
      title: "Client-Focused",
      description:
        "Every decision we make is centered around our clients' needs, ensuring their vision becomes reality.",
    },
  ];

  const milestones = [
    {
      year: "2014",
      title: "Company Founded",
      description:
        "MASS Tech Ltd was established with a vision to transform Rwanda's construction landscape.",
    },
    {
      year: "2016",
      title: "First Major Project",
      description:
        "Completed our first large-scale commercial building, establishing our reputation for quality.",
    },
    {
      year: "2018",
      title: "Team Expansion",
      description:
        "Grew our team to include specialized architects, engineers, and project managers.",
    },
    {
      year: "2020",
      title: "Sustainability Focus",
      description:
        "Integrated green building practices and sustainable construction methods across all projects.",
    },
    {
      year: "2022",
      title: "Industry Recognition",
      description:
        "Received awards for excellence in construction and sustainable building practices.",
    },
    {
      year: "2024",
      title: "Continued Growth",
      description:
        "Celebrating 150+ completed projects and expanding our services across Rwanda.",
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
              <a href="/about" className="text-blue-600 font-semibold">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About MASS Tech Ltd
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Building excellence in Rwanda through innovation, quality, and
            sustainable construction practices since 2014
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2014, MASS Tech Ltd emerged from a vision to
                transform Rwanda's construction landscape. We began as a small
                team of passionate builders and architects committed to
                delivering exceptional quality and innovative solutions.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Over the years, we've grown into Rwanda's premier construction
                company, completing over 150 projects across residential,
                commercial, and industrial sectors. Our success is built on our
                unwavering commitment to quality, sustainability, and client
                satisfaction.
              </p>
              <p className="text-lg text-gray-600">
                Today, we continue to push the boundaries of construction
                excellence while staying true to our core values of integrity,
                innovation, and community development.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="MASS Tech team"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our
              relationships with clients and communities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <value.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the experienced professionals leading MASS Tech towards
              continued excellence
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
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center">
                      <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-300 rounded mb-3 animate-pulse"></div>
                      <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : teamMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {teamMembers.map((member, index) => (
                    <div key={member.id || index} className="text-center">
                      <img
                        src={
                          member.image_url ||
                          `https://images.unsplash.com/photo-${
                            index === 0
                              ? "1472099645785-5658abf4ff4e"
                              : index === 1
                                ? "1494790108755-2616b69bb80c"
                                : index === 2
                                  ? "1507003211169-0a1dd7228f2d"
                                  : "1438761681033-6461ffad8d80"
                          }?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`
                        }
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-3">
                        {member.position || "Team Member"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {member.bio ||
                          "Dedicated professional contributing to our team's success."}
                      </p>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-blue-600 hover:text-blue-700 text-sm block mt-2"
                        >
                          {member.email}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-medium">
                    No team members added yet
                  </p>
                  <p className="text-sm">
                    Team members added in the admin panel will appear here
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones that have shaped MASS Tech into the company we are
              today
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-600"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}
                  >
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="text-blue-600 font-bold text-lg mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-blue-100">
              Building Rwanda's future, one project at a time
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-blue-200">Years of Excellence</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
              <div className="text-blue-200">Projects Completed</div>
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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Our Success Story
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to be part of our next chapter? Let's discuss how we can bring
            your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Your Project
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
