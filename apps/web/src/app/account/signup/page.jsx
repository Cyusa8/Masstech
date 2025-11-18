import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Building2 } from "lucide-react";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password || !name) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signUpWithCredentials({
        email,
        password,
        name,
        callbackUrl: "/admin",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-up. Please try again or use a different method.",
        OAuthCallback: "Sign-up failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account with this sign-up option. Try another one.",
        EmailCreateAccount:
          "This email can't be used. It may already be registered.",
        Callback: "Something went wrong during sign-up. Please try again.",
        OAuthAccountNotLinked:
          "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin:
          "Invalid email or password. If you already have an account, try signing in instead.",
        AccessDenied: "You don't have permission to sign up.",
        Configuration:
          "Sign-up isn't working right now. Please try again later.",
        Verification: "Your sign-up link has expired. Request a new one.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

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
          <p className="text-gray-600">Admin Portal</p>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Create Admin Account
          </h1>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <input
                  required
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent text-lg outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <input
                  required
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-lg outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <input
                  required
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-transparent text-lg outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href={`/account/signin${
                  typeof window !== "undefined" ? window.location.search : ""
                }`}
                className="text-blue-600 hover:text-blue-700"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
