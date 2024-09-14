"use client"; // This component will use client-side rendering

import { useState } from "react";
import { createUser } from "../services/userService";
import { useRouter } from "next/navigation";

const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createUser({ username, email, password });

      localStorage.setItem("token", data.token);
      router.push("/topic");
    } catch (error) {
      console.error("Registration failed:", error);
    }
    console.log({ username, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
