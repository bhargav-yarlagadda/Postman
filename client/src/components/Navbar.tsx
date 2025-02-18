import { UserContext } from "@/wrappers/UserWrapper";
import React, { useContext } from "react";

const Navbar = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw Error("Context Not Defined");
  }
  const { logout, user } = context;
  return (
    <nav className="flex justify-between items-center p-4 bg-[#1e1e1e] text-white shadow-md">
      <h1 className="text-xl font-semibold">Postman</h1>
      <div className="flex items-center gap-4">
        <span className="text-lg font-medium">Hello, {user}</span>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition-all duration-300 ease-in-out shadow-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
