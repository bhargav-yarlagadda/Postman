"use client";

import { ResponseContext } from "@/wrappers/ResponseWrapper";
import React, { useContext, useState } from "react";

const Response = () => {
  const [activeTab, setActiveTab] = useState<string>("Body");
  const context = useContext(ResponseContext);

  if (!context) {
    throw new Error("Response context not defined.");
  }

  const { response } = context;

  const responseData: { [key: string]: string } = {
    Body: response?.body || "No response body",
    Cookies: response?.cookies || "No cookies available",
    Headers: response?.headers?.length
      ? response.headers.map((header) => `${header.key}: ${header.value}`).join("\n")
      : "No headers available",
  };

 const renderPreview = () => {
  if (!response?.body) {
    return <div className="text-gray-400">No preview available</div>;
  }

  try {
    const parsedBody = JSON.parse(response.body);

    // Check if it's an array
    if (Array.isArray(parsedBody)) {
      return (
        <pre className="whitespace-pre-wrap break-words text-gray-300 max-h-[400px] overflow-auto bg-gray-800 p-2 rounded-md">
          {JSON.stringify(parsedBody, null, 2)}
        </pre>
      );
    }

    // If it's a JSON object, check if it has an HTML body
    if (parsedBody.body?.raw) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: parsedBody.body.raw }}
          className="p-2 bg-gray-800 rounded-md max-h-[400px] overflow-auto"
        />
      );
    }

    // Otherwise, return formatted JSON
    return (
      <pre className="whitespace-pre-wrap break-words text-gray-300 max-h-[400px] overflow-auto bg-gray-800 p-2 rounded-md">
        {JSON.stringify(parsedBody, null, 2)}
      </pre>
    );
  } catch (error) {
    return (
      <pre className="whitespace-pre-wrap break-words max-h-[400px] overflow-auto bg-gray-800 p-2 rounded-md">
        {response.body}
      </pre>
    );
  }
};


  return (
    <div
      className="max-w-screen w-full  bg-[#1e1e1e] text-white h-[400px] overflow-y-auto "
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Hide scrollbar for WebKit-based browsers */}
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* Top Tabs & Status */}
      <div className="flex justify-between  w-full items-center px-4 py-2 border-b border-gray-700 text-gray-300 text-sm">
        <div className="flex space-x-4">
          {["Body", "Cookies", "Headers", "Preview"].map((tab) => (
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
          {response?.statusCode || 204} {response?.statusMsg || "No Request available, server is idle"}
        </span>
      </div>

      {/* Response Content */}
      <div className="p-4 text-sm  h-[calc(100%-40px)] overflow-auto">
        {activeTab === "Preview" ? (
          <div className="bg-[#252526] text-gray-300 p-2 rounded-md h-full overflow-auto">
            {renderPreview()}
          </div>
        ) : (
          <pre className="bg-[#252526] text-gray-300 p-2 rounded-md whitespace-pre-wrap break-words">
            {responseData[activeTab]}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Response;
