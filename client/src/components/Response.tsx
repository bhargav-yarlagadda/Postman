'use client'

import React, { useState } from "react";

const Response = () => {
  const [activeTab, setActiveTab] = useState<string>("Body");

  // Example response data
  const responseData:{[key:string]:string} = {
    Body: "Method Not Allowed",
    Cookies: "No cookies available",
    Headers: "Content-Type: application/json\nAllow: GET, HEAD",
  };

  return (
    <div className="w-full bg-[#1e1e1e] text-white h-[300px] overflow-y-scroll shadow-md " style={{scrollbarWidth:'none'}}>
      {/* Top Tabs & Status */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700 text-gray-300 text-sm">
        <div className="flex space-x-4">
          {["Body", "Cookies", "Headers"].map((tab) => (
            <span
              key={tab}
              className={`cursor-pointer hover:text-white ${
                activeTab === tab ? "text-white border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </span>
          ))}
        </div>
        <span className="bg-red-600 text-xs px-2 py-1 rounded-md">
          405 Method Not Allowed
        </span>
      </div>

      {/* Response Content */}
      <div className="p-4 text-sm">
        <pre className="bg-[#252526] text-gray-300 p-2 rounded-md whitespace-pre-wrap">
          {responseData[activeTab]}
        </pre>
      </div>
    </div>
  );
};

export default Response;
