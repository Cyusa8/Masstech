import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  FileText,
  Building2,
  BarChart3,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  User,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: user, loading } = useUser();
  const [dashboardData, setDashboardData] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    resolvedInquiries: 0,
    totalServices: 0,
    totalProjects: 0,
    totalTeamMembers: 0,
    recentInquiries: [],
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
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

  // Check if user is admin (you may want to create a separate API to check role)
  // For now, we'll assume authenticated users are admins

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      current: true,
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
      current: false,
    },
  ];

  const stats = [
    {
      name: "Total Inquiries",
      value: dashboardData.totalInquiries,
      icon: MessageSquare,
      color: "bg-blue-500",
    },
    {
      name: "New Inquiries",
      value: dashboardData.newInquiries,
      icon: Mail,
      color: "bg-yellow-500",
    },
    {
      name: "Resolved",
      value: dashboardData.resolvedInquiries,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      name: "Services",
      value: dashboardData.totalServices,
      icon: Settings,
      color: "bg-purple-500",
    },
    {
      name: "Projects",
      value: dashboardData.totalProjects,
      icon: FileText,
      color: "bg-indigo-500",
    },
    {
      name: "Team Members",
      value: dashboardData.totalTeamMembers,
      icon: Users,
      color: "bg-green-500",
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user.name || user.email}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white rounded-lg shadow p-6 border border-gray-200"
              >
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-lg ${stat.color} bg-opacity-10 mr-4`}
                  >
                    <stat.icon
                      className={`h-6 w-6 ${stat.color.replace(
                        "bg-",
                        "text-",
                      )}`}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {loadingData ? "..." : stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Contact Inquiries
              </h2>
              <p className="text-gray-600">
                Latest inquiries from your website
              </p>
            </div>
            <div className="p-6">
              {loadingData ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading inquiries...</p>
                </div>
              ) : dashboardData.recentInquiries.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentInquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">
                            {inquiry.first_name} {inquiry.last_name}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              inquiry.status === "new"
                                ? "bg-yellow-100 text-yellow-800"
                                : inquiry.status === "in_progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : inquiry.status === "resolved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {inquiry.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{inquiry.email}</p>
                        <p className="text-sm text-gray-700 truncate">
                          {inquiry.message}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <a
                      href="/admin/inquiries"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All Inquiries →
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No contact inquiries yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="/admin/inquiries"
              className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <MessageSquare className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Inquiries
              </h3>
              <p className="text-gray-600">
                Review and respond to contact inquiries
              </p>
            </a>

            <a
              href="/admin/services"
              className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <Settings className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Services
              </h3>
              <p className="text-gray-600">
                Add, edit, or remove your services
              </p>
            </a>

            <a
              href="/admin/projects"
              className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
            >
              <FileText className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Projects
              </h3>
              <p className="text-gray-600">Showcase your completed projects</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
