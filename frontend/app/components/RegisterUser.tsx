"use client"; // This component will use client-side rendering

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import { useRouter } from "next/navigation";

const RegisterUser = () => {
  const { register, isAuthenticated } = useAuth(); // Access register and isAuthenticated from AuthContext
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Access the router

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/topic"); // Redirect if already authenticated
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password);
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <label
          className="block text-sm font-medium text-navy"
          htmlFor="username"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring darkBlue focus:border-darkBlue"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy" htmlFor="email">
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
        Register
      </button>
    </form>
  );
};

export default RegisterUser;
