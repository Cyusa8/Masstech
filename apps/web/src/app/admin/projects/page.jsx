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
  Star,
  Calendar,
  MapPin,
} from "lucide-react";

export default function ProjectsPage() {
  const { data: user, loading } = useUser();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_description: "",
    location: "",
    project_type: "",
    budget_range: "",
    completion_date: "",
    client_name: "",
    image_urls: "",
    status: "completed",
    features: "",
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description || "",
        short_description: project.short_description || "",
        location: project.location || "",
        project_type: project.project_type || "",
        budget_range: project.budget_range || "",
        completion_date: project.completion_date
          ? new Date(project.completion_date).toISOString().split("T")[0]
          : "",
        client_name: project.client_name || "",
        image_urls: Array.isArray(project.image_urls)
          ? project.image_urls.join("\n")
          : "",
        status: project.status,
        features: Array.isArray(project.features)
          ? project.features.join("\n")
          : "",
        is_featured: project.is_featured,
        is_active: project.is_active,
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: "",
        description: "",
        short_description: "",
        location: "",
        project_type: "",
        budget_range: "",
        completion_date: "",
        client_name: "",
        image_urls: "",
        status: "completed",
        features: "",
        is_featured: false,
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      ...formData,
      image_urls: formData.image_urls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0),
      features: formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
      completion_date: formData.completion_date || null,
    };

    try {
      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : "/api/admin/projects";
      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        fetchProjects();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const toggleFeatured = async (id, isFeatured) => {
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_featured: !isFeatured }),
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to update project featured status:", error);
    }
  };

  // Redirect if not authenticated
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
      current: true,
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

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "on_hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">
                Projects Management
              </h1>
              <p className="text-gray-600">
                Showcase your completed projects and portfolio
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Project
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingProjects ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className={`bg-white rounded-lg shadow p-6 border border-gray-200 ${
                    !project.is_active ? "opacity-60" : ""
                  }`}
                >
                  {/* Project Image */}
                  {project.image_urls && project.image_urls.length > 0 && (
                    <div className="mb-4">
                      <img
                        src={project.image_urls[0]}
                        alt={project.name}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      {project.is_featured && (
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {project.short_description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-600">
                      {project.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {project.location}
                        </div>
                      )}
                      {project.completion_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(
                            project.completion_date,
                          ).toLocaleDateString()}
                        </div>
                      )}
                      {project.client_name && (
                        <p className="text-sm">
                          <span className="font-medium">Client:</span>{" "}
                          {project.client_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          project.status,
                        )}`}
                      >
                        {project.status.replace("_", " ")}
                      </span>
                      {project.is_active && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          toggleFeatured(project.id, project.is_featured)
                        }
                        className={`text-yellow-600 hover:text-yellow-800 ${
                          project.is_featured ? "text-yellow-500" : ""
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            project.is_featured ? "fill-current" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => openModal(project)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
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
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No projects found</p>
                <button
                  onClick={() => openModal()}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Your First Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal - This will be in a separate part due to length */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
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
                      Short Description *
                    </label>
                    <input
                      type="text"
                      value={formData.short_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          short_description: e.target.value,
                        })
                      }
                      placeholder="Brief description for cards and previews"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Detailed description of the project"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="Project location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type
                      </label>
                      <input
                        type="text"
                        value={formData.project_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            project_type: e.target.value,
                          })
                        }
                        placeholder="e.g., Residential, Commercial"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          client_name: e.target.value,
                        })
                      }
                      placeholder="Client or company name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <input
                        type="text"
                        value={formData.budget_range}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            budget_range: e.target.value,
                          })
                        }
                        placeholder="e.g., $50,000 - $100,000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Completion Date
                      </label>
                      <input
                        type="date"
                        value={formData.completion_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            completion_date: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >
                      <option value="planning">Planning</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URLs (one per line)
                    </label>
                    <textarea
                      value={formData.image_urls}
                      onChange={(e) =>
                        setFormData({ ...formData, image_urls: e.target.value })
                      }
                      rows={4}
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features (one per line)
                    </label>
                    <textarea
                      value={formData.features}
                      onChange={(e) =>
                        setFormData({ ...formData, features: e.target.value })
                      }
                      rows={4}
                      placeholder="List project features, one per line"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={formData.is_featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_featured: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="is_featured"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Featured (show in highlighted sections)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_active: e.target.checked,
                          })
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
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
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
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
