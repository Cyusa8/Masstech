import useAuth from "@/utils/useAuth";
import { Building2 } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
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

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Sign Out
          </h1>

          <p className="text-gray-600 text-center mb-8">
            Are you sure you want to sign out of your admin account?
          </p>

          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              Sign Out
            </button>

            <a
              href="/admin"
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 text-center"
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
