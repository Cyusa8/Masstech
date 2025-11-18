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
  Upload,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function ServicesPage() {
  const { data: user, loading } = useUser();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    price_range: "",
    features: "",
    image_url: "",
    icon_name: "",
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoadingServices(false);
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        short_description: service.short_description || "",
        description: service.description || "",
        price_range: service.price_range || "",
        features: Array.isArray(service.features)
          ? service.features.join("\n")
          : "",
        image_url: service.image_url || "",
        icon_name: service.icon_name || "",
        is_active: service.is_active,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        short_description: "",
        description: "",
        price_range: "",
        features: "",
        image_url: "",
        icon_name: "",
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      name: "",
      short_description: "",
      description: "",
      price_range: "",
      features: "",
      image_url: "",
      icon_name: "",
      is_active: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serviceData = {
      ...formData,
      features: formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
    };

    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : "/api/admin/services";
      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      if (response.ok) {
        fetchServices();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  const deleteService = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Failed to update service status:", error);
    }
  };

  const moveService = async (id, direction) => {
    const service = services.find((s) => s.id === id);
    const currentOrder = service.order_position;
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_position: newOrder }),
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Failed to reorder service:", error);
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
      current: true,
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
                Services Management
              </h1>
              <p className="text-gray-600">
                Manage your company services and what you offer to clients
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Service
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingServices ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading services...</p>
              </div>
            ) : services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className={`bg-white rounded-lg shadow p-6 border border-gray-200 ${
                    !service.is_active ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {service.short_description}
                      </p>
                      {service.price_range && (
                        <p className="text-sm text-green-600 font-medium">
                          {service.price_range}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => moveService(service.id, "up")}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={service.order_position === 1}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveService(service.id, "down")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {service.features && service.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Features:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                        {service.features.length > 3 && (
                          <li className="text-gray-400">
                            +{service.features.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          service.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {service.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          toggleActive(service.id, service.is_active)
                        }
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {service.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openModal(service)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
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
                <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No services found</p>
                <button
                  onClick={() => openModal()}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Your First Service
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
                  {editingService ? "Edit Service" : "Add New Service"}
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
                      Service Name *
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
                      Price Range
                    </label>
                    <input
                      type="text"
                      value={formData.price_range}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price_range: e.target.value,
                        })
                      }
                      placeholder="e.g., $1,000 - $5,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
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
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    placeholder="Detailed description of the service"
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
                    placeholder="List service features, one per line"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon Name
                    </label>
                    <input
                      type="text"
                      value={formData.icon_name}
                      onChange={(e) =>
                        setFormData({ ...formData, icon_name: e.target.value })
                      }
                      placeholder="Building, Home, Wrench, etc."
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
                    {editingService ? "Update Service" : "Create Service"}
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
