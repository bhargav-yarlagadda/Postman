"use client";

import React, { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/wrappers/UserWrapper";

const Page = () => {
  const router = useRouter();
  const context = useContext(UserContext);
  const user = context?.user;
  const loading = context?.loading;
    const logout = context?.logout
  // Wait for loading to complete before checking user
  useEffect(() => {
    if (loading) return;

    if (user) {
      setTimeout(() => {
        router.push("/");
      }, 100); // Small delay to allow state update
    } else {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80 text-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user} 👋</h2>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
      
};

export default Page;
