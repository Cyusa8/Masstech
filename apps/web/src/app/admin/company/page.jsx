import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  FileText,
  Building2,
  LogOut,
  User,
  Save,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function CompanyInfoPage() {
  const { data: user, loading } = useUser();
  const [companyInfo, setCompanyInfo] = useState({
    company_name: "",
    tagline: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    social_media: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    business_hours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    logo_url: "",
    hero_image_url: "",
    about_image_url: "",
  });
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCompanyInfo();
    }
  }, [user]);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch("/api/admin/company");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setCompanyInfo({
            ...companyInfo,
            ...data,
            social_media: {
              ...companyInfo.social_media,
              ...(data.social_media || {}),
            },
            business_hours: {
              ...companyInfo.business_hours,
              ...(data.business_hours || {}),
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch company info:", error);
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/company", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyInfo),
      });

      if (response.ok) {
        alert("Company information updated successfully!");
      } else {
        alert("Failed to update company information");
      }
    } catch (error) {
      console.error("Failed to save company info:", error);
      alert("Failed to update company information");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setCompanyInfo({ ...companyInfo, [field]: value });
  };

  const updateSocialMedia = (platform, value) => {
    setCompanyInfo({
      ...companyInfo,
      social_media: {
        ...companyInfo.social_media,
        [platform]: value,
      },
    });
  };

  const updateBusinessHours = (day, value) => {
    setCompanyInfo({
      ...companyInfo,
      business_hours: {
        ...companyInfo.business_hours,
        [day]: value,
      },
    });
  };

  // Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/account/signin";
    }
    return null;
  }

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      current: false,
    },
    {
      name: "Contact Inquiries",
      icon: MessageSquare,
      href: "/admin/inquiries",
      current: false,
    },
    {
      name: "Services",
      icon: Settings,
      href: "/admin/services",
      current: false,
    },
    {
      name: "Projects",
      icon: FileText,
      href: "/admin/projects",
      current: false,
    },
    {
      name: "Team Members",
      icon: Users,
      href: "/admin/team",
      current: false,
    },
    {
      name: "Company Info",
      icon: Building2,
      href: "/admin/company",
      current: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">MASS Tech</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                item.current
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </a>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 w-64 p-6 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <a
              href="/account/logout"
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <LogOut className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Company Information
            </h1>
            <p className="text-gray-600">
              Update your company details and contact information
            </p>
          </div>

          {loadingInfo ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">
                Loading company information...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyInfo.company_name}
                      onChange={(e) =>
                        updateField("company_name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={companyInfo.tagline || ""}
                      onChange={(e) => updateField("tagline", e.target.value)}
                      placeholder="e.g., Building Excellence in Rwanda"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={companyInfo.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={4}
                    placeholder="Brief description of your company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={companyInfo.phone || ""}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+250 XXX XXX XXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={companyInfo.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="info@company.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="h-4 w-4 inline mr-1" />
                      Website
                    </label>
                    <input
                      type="url"
                      value={companyInfo.website || ""}
                      onChange={(e) => updateField("website", e.target.value)}
                      placeholder="https://www.company.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Address
                  </label>
                  <textarea
                    value={companyInfo.address || ""}
                    onChange={(e) => updateField("address", e.target.value)}
                    rows={3}
                    placeholder="Complete business address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Social Media Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Facebook className="h-4 w-4 inline mr-1" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={companyInfo.social_media?.facebook || ""}
                      onChange={(e) =>
                        updateSocialMedia("facebook", e.target.value)
                      }
                      placeholder="https://facebook.com/yourcompany"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Instagram className="h-4 w-4 inline mr-1" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={companyInfo.social_media?.instagram || ""}
                      onChange={(e) =>
                        updateSocialMedia("instagram", e.target.value)
                      }
                      placeholder="https://instagram.com/yourcompany"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Twitter className="h-4 w-4 inline mr-1" />
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={companyInfo.social_media?.twitter || ""}
                      onChange={(e) =>
                        updateSocialMedia("twitter", e.target.value)
                      }
                      placeholder="https://twitter.com/yourcompany"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Linkedin className="h-4 w-4 inline mr-1" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={companyInfo.social_media?.linkedin || ""}
                      onChange={(e) =>
                        updateSocialMedia("linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  <Clock className="h-5 w-5 inline mr-2" />
                  Business Hours
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(companyInfo.business_hours || {}).map(
                    ([day, hours]) => (
                      <div key={day}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                          {day}
                        </label>
                        <input
                          type="text"
                          value={hours}
                          onChange={(e) =>
                            updateBusinessHours(day, e.target.value)
                          }
                          placeholder="9:00 AM - 5:00 PM or Closed"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Company Images
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={companyInfo.logo_url || ""}
                      onChange={(e) => updateField("logo_url", e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Image URL
                    </label>
                    <input
                      type="url"
                      value={companyInfo.hero_image_url || ""}
                      onChange={(e) =>
                        updateField("hero_image_url", e.target.value)
                      }
                      placeholder="https://example.com/hero-image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About Page Image URL
                    </label>
                    <input
                      type="url"
                      value={companyInfo.about_image_url || ""}
                      onChange={(e) =>
                        updateField("about_image_url", e.target.value)
                      }
                      placeholder="https://example.com/about-image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium disabled:opacity-50"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {saving ? "Saving..." : "Save Company Information"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
