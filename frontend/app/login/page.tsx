"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/topic");
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-light">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-darkBlue mb-4">Login</h2>
        <div className="max-w-md mx-auto p-6 bg-light rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-600">{error}</p>}
            <div>
              <label
                className="block text-sm font-medium text-navy"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring darkBlue focus:border-darkBlue"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-navy"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring darkBlue focus:border-darkBlue"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-darkBlue text-white py-2 rounded-md hover:bg-softBlue transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-navy">
            Dont have an account?{" "}
            <a
              href="/register"
              className="text-darkBlue font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
