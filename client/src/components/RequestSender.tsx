"use client";
import { RequestContext } from "@/wrappers/RequestWrapper";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Toast } from "./Toast";
import { IParams, IHeader, Request } from "../../types";
import { ResponseContext } from "@/wrappers/ResponseWrapper";

const RequestSender: React.FC = () => {
  const context = useContext(RequestContext);
  const responseContext = useContext(ResponseContext)
  
  if (!context) {
    throw new Error("Error initializing request context");
  }
  const { currentRequest, setCurrentRequest, requests, setRequests } = context;
  if(!responseContext){
    throw new Error("Error initializing request context");

  }
  const {setResponse}=responseContext
  const [activeTab, setActiveTab] = useState<"params" | "headers" | "body">(
    "params"
  );
  const [params, setParams] = useState<IParams[]>(
    currentRequest.params || [{ key: "", value: "", description: "" }]
  );
  const [headers, setHeaders] = useState<IHeader[]>(
    currentRequest.headers || [{ key: "", value: "", description: "" }]
  );
  const [body, setBody] = useState<string>(currentRequest.body || "");
  const [url, setUrl] = useState<string>(currentRequest.url || "");
  const [method, setMethod] = useState<"GET" | "POST" | "DELETE" | "PUT">(
    currentRequest.method || "GET"
  );
  const [showToast, setShowToast] = useState(false);
  const tabs: string[] = ["Params", "Headers", "Body"];

  useEffect(() => {
    setParams(
      currentRequest.params || [{ key: "", value: "", description: "" }]
    );
    setHeaders(
      currentRequest.headers || [{ key: "", value: "", description: "" }]
    );
    setBody(currentRequest.body || "");
    setUrl(currentRequest.url || "");
    setMethod(currentRequest.method || "GET");
  }, [currentRequest]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >, // Add HTMLSelectElement here
    index: number | null,
    section: "params" | "headers" | "body" | "url" | "method"
  ) => {
    const { name, value } = e.target;

    if (section === "params" && index !== null) {
      const newParams = [...params];
      newParams[index] = { ...newParams[index], [name]: value };
      setParams(newParams);
    } else if (section === "headers" && index !== null) {
      const newHeaders = [...headers];
      newHeaders[index] = { ...newHeaders[index], [name]: value };
      setHeaders(newHeaders);
    } else if (section === "body") {
      setBody(value);
    } else if (section === "url") {
      setUrl(value);
    } else if (section === "method") {
      setMethod(value as "GET" | "POST" | "DELETE" | "PUT");
    }
  };

  const addRow = (section: "params" | "headers") => {
    if (section === "params") {
      setParams([...params, { key: "", value: "", description: "" }]);
    } else if (section === "headers") {
      setHeaders([...headers, { key: "", value: "", description: "" }]);
    }
  };
  const sendRequest = async () => {
    try {
      const formattedHeaders = currentRequest.headers.reduce<
        Record<string, string>
      >((acc, header) => {
        acc[header.key] = header.value;
        return acc;
      }, {});
  
      const requestPayload = {
        method: currentRequest.method,
        url: currentRequest.url,
        headers: formattedHeaders, // Ensure it's an object, not an array
        body: currentRequest.body || "",
      };
  
      if (!requestPayload.url || !requestPayload.method) {
        setShowToast(true);
        return;
      }
  
      try {
        const response = await axios.post("http://localhost:8080/", requestPayload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Ensures cookies are included in the request
        });
  
        setResponse({
          statusCode: response.status.toString(),
          statusMsg: response.statusText,
          body: JSON.stringify(response.data), // Ensure body is a string
          headers: Object.entries(response.headers).map(([key, value]) => ({ key, value })), // Convert headers to IHeader[]
          cookies: response.config?.xsrfCookieName ?? "", // Ensure cookies is a string
        });
      } catch (error: any) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        setResponse({
          statusCode: "500",
          statusMsg: "Invalid URL",
          body: "Could Not Resolve DNS for the URL",
          headers: [], // Empty array for headers since no response is available
          cookies: "", // No cookies in case of failure
        });
      }
    } catch (error: any) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };
  
  const onSave = () => {
    const updatedRequest: Request = {
      id: currentRequest.id, // Ensure the ID is preserved
      url,
      method,
      body,
      params,
      headers,
    };
    setCurrentRequest(updatedRequest);
    const newReqs = requests.map((req) => {
      if (req.id === currentRequest.id) {
        return updatedRequest;
      }
      return req;
    });
    setRequests(newReqs);
  };

  return (
    <div
      style={{ scrollbarWidth: "none" }}
      className="flex flex-col p-4 max-h-[400px] overflow-y-scroll bg-[#1e1e1e] text-white"
    >
      {showToast && (
        <Toast
          message="Method and URL cannot be empty"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg">
        <select
          value={method}
          onChange={(e) => handleInputChange(e, null, "method")}
          className="px-1 py-2 bg-blue-800 rounded-md text-white"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>

        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => handleInputChange(e, null, "url")}
          className="flex-grow px-3 py-2 bg-gray-700 rounded text-white outline-none"
        />
        <button
          onClick={sendRequest}
          className="px-4 bg-blue-500 rounded-md py-2"
        >
          send
        </button>
      </div>

      <div className="flex gap-6 items-center border-b border-gray-700 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 text-lg ${
              activeTab === tab.toLowerCase()
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-400"
            }`}
            onClick={() =>
              setActiveTab(tab.toLowerCase() as "params" | "headers" | "body")
            }
          >
            {tab}
          </button>
        ))}
        <button
          onClick={onSave}
          className="px-4 bg-sky-500 h-8 hover:bg-sky-700 rounded shadow-md"
        >
          Save
        </button>
      </div>

      <div className="mt-4 bg-gray-800 p-4 h-[350px] rounded-lg">
        {activeTab === "params" && (
          <div>
            {params.map((param, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <input
                  type="text"
                  name="key"
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => handleInputChange(e, index, "params")}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
                <input
                  type="text"
                  name="value"
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => handleInputChange(e, index, "params")}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={param.description}
                  onChange={(e) => handleInputChange(e, index, "params")}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
              </div>
            ))}
            <button
              onClick={() => addRow("params")}
              className="px-4 py-2 mt-2 bg-green-500 hover:bg-green-600 rounded"
            >
              Add Param
            </button>
          </div>
        )}

        {activeTab === "headers" && (
          <div>
            {headers.map((header, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <input
                  type="text"
                  name="key"
                  placeholder="Key"
                  value={header.key}
                  onChange={(e) => handleInputChange(e, index, "headers")}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
                <input
                  type="text"
                  name="value"
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) => handleInputChange(e, index, "headers")}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={header.description}
                  onChange={(e) => handleInputChange(e, index, "headers")}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
              </div>
            ))}
            <button
              onClick={() => addRow("headers")}
              className="px-4 py-2 mt-2 bg-green-500 hover:bg-green-600 rounded"
            >
              Add Header
            </button>
          </div>
        )}

        {activeTab === "body" && (
          <textarea
            value={body}
            style={{ scrollbarWidth: "none" }}
            onChange={(e) => handleInputChange(e, null, "body")}
            placeholder="Enter body content"
            rows={7}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
          />
        )}
      </div>
    </div>
  );
};

export default RequestSender;
