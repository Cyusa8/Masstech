import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Users,
  Building2,
  MessageSquare,
  Settings,
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Menu,
  X,
  Home,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (!token || !userData) {
      window.location.href = "/admin/login";
      return;
    }

    setUser(JSON.parse(userData));
  }, []);

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");

      const [services, projects, team, contacts, company] = await Promise.all([
        fetch("/api/services").then((res) => res.json()),
        fetch("/api/projects").then((res) => res.json()),
        fetch("/api/team").then((res) => res.json()),
        fetch("/api/contact").then((res) => res.json()),
        fetch("/api/company").then((res) => res.json()),
      ]);

      return {
        services: services.data || [],
        projects: projects.data || [],
        team: team.data || [],
        contacts: contacts.data || [],
        company: company.data || {},
      };
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "services", label: "Services", icon: Building2 },
    { id: "projects", label: "Projects", icon: FileText },
    { id: "team", label: "Team", icon: Users },
    { id: "contacts", label: "Contact Inquiries", icon: MessageSquare },
    { id: "company", label: "Company Info", icon: Settings },
  ];

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const data = dashboardData || {
    services: [],
    projects: [],
    team: [],
    contacts: [],
    company: {},
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#006DFF] to-[#2F7BFF] rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">MASS Tech Ltd</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-[#006DFF] to-[#2F7BFF] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Users size={20} className="text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {user.name || "Admin"}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Home size={16} />
                <span>View Website</span>
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Total Services
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {data.services.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Building2 size={24} className="text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Total Projects
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {data.projects.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <FileText size={24} className="text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Team Members</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {data.team.length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Users size={24} className="text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        New Inquiries
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {data.contacts.filter((c) => c.status === "new").length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                      <MessageSquare size={24} className="text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Contact Inquiries */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Recent Inquiries
                    </h3>
                    <button
                      onClick={() => setActiveTab("contacts")}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {data.contacts.slice(0, 5).map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {contact.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {contact.email}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(contact.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            contact.status === "new"
                              ? "bg-red-100 text-red-800"
                              : contact.status === "contacted"
                                ? "bg-yellow-100 text-yellow-800"
                                : contact.status === "responded"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                          }`}
                        >
                          {contact.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("services")}
                      className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <Plus size={20} className="text-blue-600" />
                      <span className="text-blue-600 font-medium">
                        Add New Service
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("projects")}
                      className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                    >
                      <Plus size={20} className="text-green-600" />
                      <span className="text-green-600 font-medium">
                        Add New Project
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("team")}
                      className="w-full flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                    >
                      <Plus size={20} className="text-purple-600" />
                      <span className="text-purple-600 font-medium">
                        Add Team Member
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content will be rendered based on activeTab */}
          {activeTab === "services" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Services Management
                </h3>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                  <Plus size={16} />
                  <span>Add Service</span>
                </button>
              </div>
              <div className="text-center py-8 text-gray-500">
                Services management interface will be implemented here.
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Projects Management
                </h3>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                  <Plus size={16} />
                  <span>Add Project</span>
                </button>
              </div>
              <div className="text-center py-8 text-gray-500">
                Projects management interface will be implemented here.
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Team Management
                </h3>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                  <Plus size={16} />
                  <span>Add Team Member</span>
                </button>
              </div>
              <div className="text-center py-8 text-gray-500">
                Team management interface will be implemented here.
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Contact Inquiries
              </h3>
              <div className="space-y-4">
                {data.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 border border-gray-200 rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {contact.name}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              contact.status === "new"
                                ? "bg-red-100 text-red-800"
                                : contact.status === "contacted"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : contact.status === "responded"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                          >
                            {contact.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <Mail size={14} />
                            <span>{contact.email}</span>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone size={14} />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Calendar size={14} />
                            <span>
                              {new Date(
                                contact.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">
                          <strong>Subject:</strong> {contact.subject}
                        </p>
                        <p className="text-gray-700">{contact.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "company" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Company Information
              </h3>
              <div className="text-center py-8 text-gray-500">
                Company information management interface will be implemented
                here.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
