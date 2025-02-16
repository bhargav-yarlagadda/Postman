"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "@/wrappers/UserWrapper";
const SignInPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const context = useContext(UserContext)
  if(!context){
    throw Error("Context Undefied.")
  }
  const {setUser}=context 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
        console.log(1)
        const res = await fetch("http://localhost:8080/auth/sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include", // Ensures cookies are sent
          });
          
          console.log(2)

      const data = await res.json();
      console.log(3)
      if (res.ok) {
        setUser(username)
        router.push("/"); // Redirect after login
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (error:any) {
        console.log("error ",error,error?.message)
      setMessage("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 text-white transition-all duration-300 hover:bg-blue-700 active:scale-95"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-400">{message}</p>
        )}
        <p className="mt-4 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
