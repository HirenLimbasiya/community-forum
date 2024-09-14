"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "../services/userService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
      if (data?.token) {
        localStorage.setItem("token", data.token);
        router.push("/topic");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-semibold text-darkBlue mb-6">Login</h1>

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
  );
};

export default LoginPage;
