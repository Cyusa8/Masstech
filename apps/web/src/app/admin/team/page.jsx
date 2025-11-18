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
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";

export default function TeamPage() {
  const { data: user, loading } = useUser();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    image_url: "",
    email: "",
    phone: "",
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      fetchTeamMembers();
    }
  }, [user]);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/admin/team");
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error);
    } finally {
      setLoadingTeam(false);
    }
  };

  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        position: member.position || "",
        bio: member.bio || "",
        image_url: member.image_url || "",
        email: member.email || "",
        phone: member.phone || "",
        is_active: member.is_active,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: "",
        position: "",
        bio: "",
        image_url: "",
        email: "",
        phone: "",
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setFormData({
      name: "",
      position: "",
      bio: "",
      image_url: "",
      email: "",
      phone: "",
      is_active: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingMember
        ? `/api/admin/team/${editingMember.id}`
        : "/api/admin/team";
      const method = editingMember ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchTeamMembers();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to save team member:", error);
    }
  };

  const deleteMember = async (id) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTeamMembers();
      }
    } catch (error) {
      console.error("Failed to delete team member:", error);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        fetchTeamMembers();
      }
    } catch (error) {
      console.error("Failed to update team member status:", error);
    }
  };

  const moveMember = async (id, direction) => {
    const member = teamMembers.find((m) => m.id === id);
    const currentOrder = member.order_position;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    try {
      const response = await fetch(`/api/admin/team/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_position: newOrder }),
      });

      if (response.ok) {
        fetchTeamMembers();
      }
    } catch (error) {
      console.error("Failed to reorder team member:", error);
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
      current: true,
    },
    {
      name: "Company Info",
      icon: Building2,
      href: "/admin/company",
      current: false,
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
              <p className="text-gray-600">
                Manage your team members and their profiles
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Team Member
            </button>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingTeam ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading team members...</p>
              </div>
            ) : teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`bg-white rounded-lg shadow p-6 border border-gray-200 ${
                    !member.is_active ? "opacity-60" : ""
                  }`}
                >
                  {/* Member Photo */}
                  <div className="flex items-center justify-center mb-4">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="text-center mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {member.name}
                        </h3>
                        {member.position && (
                          <p className="text-sm text-blue-600 font-medium">
                            {member.position}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <button
                          onClick={() => moveMember(member.id, "up")}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={member.order_position === 1}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveMember(member.id, "down")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {member.bio && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    <div className="space-y-2 text-sm text-gray-600">
                      {member.email && (
                        <div className="flex items-center justify-center">
                          <Mail className="h-4 w-4 mr-1" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center justify-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          member.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          toggleActive(member.id, member.is_active)
                        }
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {member.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openModal(member)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No team members found</p>
                <button
                  onClick={() => openModal()}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Your First Team Member
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingMember ? "Edit Team Member" : "Add New Team Member"}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position/Title
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      placeholder="e.g., CEO, Project Manager"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio/Description
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    placeholder="Brief bio or description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="member@company.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+250 XXX XXX XXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Active (show on website)
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingMember ? "Update Member" : "Add Member"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
