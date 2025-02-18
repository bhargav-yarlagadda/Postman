"use client";

import { FiPlus } from "react-icons/fi";
import React, { useState, useContext } from "react";
import { FaRegSave } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { RequestContext } from "@/wrappers/RequestWrapper";
import { Request } from "@/wrappers/RequestWrapper";

interface TabType {
  id: number;
  name: string;
}

const AddTab = () => {
  const [tabs, setTabs] = useState<TabType[]>([{ id: 0, name: "Request 1" }]);
  const requestContext = useContext(RequestContext);

  if (!requestContext) {
    throw new Error("AddTab must be used within a RequestProvider");
  }

  const {requests, setRequests, currentRequest, setCurrentRequest} = requestContext;

  // Function to add a new request
  const addNewRequest = () => {
    const newRequest: Request = {
      method: "GET",
      url: "",
      params: [],
      headers: [],
      body: "",
    };

    const newTabId = tabs.length;
    setTabs((prevTabs) => [
      ...prevTabs,
      { id: newTabId, name: `Request ${newTabId + 1}` },
    ]);
    setRequests((prevRequests) => [...prevRequests, newRequest]);
  };

  // Function to delete a request
  const deleteRequest = (index: number) => {
    setTabs((prevTabs) => prevTabs.filter((_, i) => i !== index));
    setRequests((prevRequests) => prevRequests.filter((_, i) => i !== index));
  };

  // Function to set the current request when a tab is clicked
  const setCurrentTabRequest = (index: number) => {
    const selectedRequest = requests[index];
    setCurrentRequest(selectedRequest);
  };

  // Function to save the request
  const saveRequest = () => {
    console.log("Saved Requests:", requests);
  };

  return (
    <div className="flex items-center w-full bg-gray-900 py-2 px-3">
      {/* Scrollable Tabs */}
      <div className="flex-1 overflow-x-auto flex items-center space-x-3">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className="relative min-w-max px-4 py-2 text-sm text-white bg-[#2D4263] rounded-md shadow-md flex items-center truncate"
          >
            <button
              onClick={() => setCurrentTabRequest(index)}
              className="text-white hover:text-gray-300"
            >
              {tab.name}
            </button>
            {/* Delete Button */}
            <button
              onClick={() => deleteRequest(index)}
              className="ml-2 text-white hover:text-red-400"
            >
              <MdClose />
            </button>
          </div>
        ))}
      </div>

      {/* Add Tab Button */}
      <button
        onClick={addNewRequest}
        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow-md transition-all duration-300 ease-in-out ml-3"
      >
        <FiPlus />
      </button>

      {/* Save Button */}
      <button
        onClick={saveRequest}
        className="bg-[#2D4263] flex items-center justify-between px-3 hover:bg-[#1a2e50] text-white py-2 text-md rounded-[3px] ml-3"
      >
        Save <FaRegSave />
      </button>
    </div>
  );
};

export default AddTab;
