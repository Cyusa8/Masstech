import { useState, useEffect } from "react";
import { Building2, Shield, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminSetupPage() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!email || !password || !name || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Admin account created successfully! You can now sign in.");
        setIsCreated(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
      } else {
        setError(data.error || "Failed to create admin account");
      }
    } catch (error) {
      setError("Failed to create admin account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                MASS Tech Ltd
              </span>
            </div>
            <p className="text-gray-600">Admin Portal Setup</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Setup Complete!
            </h1>
            <p className="text-gray-600 mb-8">
              Your admin account has been created successfully. You can now
              access the admin dashboard.
            </p>
            <a
              href="/account/signin"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              MASS Tech Ltd
            </span>
          </div>
          <p className="text-gray-600">Admin Portal Setup</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Create Admin Account
          </h1>
          <p className="text-gray-600 text-center mb-8 text-sm">
            This page allows you to create the first admin account for your
            website.
            <br />
            <strong>Important:</strong> Delete this page after creating your
            admin account for security.
          </p>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Security Notice</p>
                <p>
                  Remove this setup page after creating your admin account to
                  prevent unauthorized access.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating Admin Account..." : "Create Admin Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an admin account?{" "}
            <a
              href="/account/signin"
              className="text-blue-600 hover:text-blue-700"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
