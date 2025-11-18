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
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Save,
} from "lucide-react";

export default function InquiriesPage() {
  const { data: user, loading } = useUser();
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [sendingResponse, setSendingResponse] = useState(false);

  useEffect(() => {
    if (user) {
      fetchInquiries();
    }
  }, [user]);

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/admin/inquiries");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const openModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.admin_notes || "");
    setSelectedStatus(inquiry.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInquiry(null);
    setAdminNotes("");
    setSelectedStatus("");
  };

  const updateInquiry = async () => {
    if (!selectedInquiry) return;

    try {
      const response = await fetch(
        `/api/admin/inquiries/${selectedInquiry.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
            admin_notes: adminNotes,
          }),
        },
      );

      if (response.ok) {
        fetchInquiries();
        closeModal();
      }
    } catch (error) {
      console.error("Failed to update inquiry:", error);
    }
  };

  const sendResponse = async () => {
    if (!selectedInquiry || !responseMessage.trim()) return;

    setSendingResponse(true);
    try {
      const response = await fetch(
        `/api/admin/inquiries/${selectedInquiry.id}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: responseMessage,
            recipientEmail: selectedInquiry.email,
            recipientName: `${selectedInquiry.first_name} ${selectedInquiry.last_name}`,
          }),
        },
      );

      if (response.ok) {
        alert("Response sent successfully!");
        setResponseMessage("");
        // Update status to in_progress if it was new
        if (selectedInquiry.status === "new") {
          setSelectedStatus("in_progress");
        }
      } else {
        alert("Failed to send response. Please try again.");
      }
    } catch (error) {
      console.error("Failed to send response:", error);
      alert("Failed to send response. Please try again.");
    } finally {
      setSendingResponse(false);
    }
  };

  const deleteInquiry = async (id) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchInquiries();
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
    }
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesStatus =
      statusFilter === "all" || inquiry.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      inquiry.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

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
      current: true,
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

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Contact Inquiries
            </h1>
            <p className="text-gray-600">
              Manage and respond to customer inquiries from your website
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Inquiries Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loadingInquiries ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading inquiries...</p>
              </div>
            ) : filteredInquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {inquiry.first_name} {inquiry.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {inquiry.email}
                            </div>
                            {inquiry.phone && (
                              <div className="text-sm text-gray-500">
                                {inquiry.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {inquiry.service || "Not specified"}
                          </div>
                          {inquiry.budget && (
                            <div className="text-sm text-gray-500">
                              Budget: {inquiry.budget}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              inquiry.status,
                            )}`}
                          >
                            {getStatusIcon(inquiry.status)}
                            <span className="ml-1">
                              {inquiry.status.replace("_", " ")}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openModal(inquiry)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No inquiries found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Inquiry Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedInquiry.first_name} {selectedInquiry.last_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedInquiry.email}
                      </p>
                    </div>
                    {selectedInquiry.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInquiry.phone}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedInquiry.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Project Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedInquiry.service && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Service
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInquiry.service}
                        </p>
                      </div>
                    )}
                    {selectedInquiry.budget && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Budget
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInquiry.budget}
                        </p>
                      </div>
                    )}
                    {selectedInquiry.timeline && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Timeline
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedInquiry.timeline}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>

                {/* Status and Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Add notes about this inquiry..."
                  />
                </div>

                {/* Response Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Send Response Email
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Message
                    </label>
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      placeholder={`Dear ${selectedInquiry.first_name},\n\nThank you for your inquiry about ${selectedInquiry.service || "our services"}. We have received your message and would like to...\n\nBest regards,\nMASS Tech Team`}
                    />
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>
                      This will send an email response to:{" "}
                      <strong>{selectedInquiry.email}</strong>
                    </p>
                    <p>
                      The response will be sent from your company email address.
                    </p>
                  </div>
                  <button
                    onClick={sendResponse}
                    disabled={!responseMessage.trim() || sendingResponse}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {sendingResponse ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Response
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateInquiry}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
