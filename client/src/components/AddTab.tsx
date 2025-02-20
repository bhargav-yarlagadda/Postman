"use client";

import { FiPlus } from "react-icons/fi";
import React, { useState, useContext } from "react";
import { FaRegSave } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { RequestContext } from "@/wrappers/RequestWrapper";
import { Request } from "@/wrappers/RequestWrapper";

interface TabType {
  id: string; // UUID
  name: string;
}

const AddTab = () => {
  const [tabs, setTabs] = useState<TabType[]>([{ id: uuidv4(), name: "Request 1" }]);
  const requestContext = useContext(RequestContext);

  if (!requestContext) {
    throw new Error("AddTab must be used within a RequestProvider");
  }

  const { requests, setRequests, currentRequest, setCurrentRequest } = requestContext;

  // Function to add a new request
  const addNewRequest = () => {
    const newRequest: Request = {
      id: uuidv4(),
      method: "GET",
      url: "",
      params: [],
      headers: [],
      body: "",
    };

    const newTab = {
      id: newRequest.id,
      name: `Request ${tabs.length + 1}`,
    };

    setTabs((prevTabs) => [...prevTabs, newTab]);
    setRequests((prevRequests) => [...prevRequests, newRequest]);
  };

  // Function to delete a request
  const deleteRequest = (id: string) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
    setRequests((prevRequests) => prevRequests.filter((request) => request.id !== id));
  };

  // Function to set the current request when a tab is clicked
  const setCurrentTabRequest = (id: string) => {
    const selectedRequest = requests.find((request) => request.id === id);
    if (selectedRequest) setCurrentRequest(selectedRequest);
  };

  // Function to save the request
  const saveRequest = () => {
    console.log("Saved Requests:", requests);
  };

  return (
    <div className="flex items-center w-full bg-[#1e1e1e] py-2 px-4">
      {/* Scrollable Tabs */}
      <div className="flex-1 overflow-x-auto flex items-center space-x-3 scrollbar-hide">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`relative flex items-center bg-[#2D4263] text-white px-4 py-2 rounded-t-lg rounded-b-sm shadow-md transition-all`}
          >
            {/* Tab Name */}
            <button
              onClick={() => setCurrentTabRequest(tab.id)}
              className="truncate text-sm font-medium hover:text-gray-300"
            >
              {tab.name}
            </button>

            {/* Delete Button */}
            <button
              onClick={() => deleteRequest(tab.id)}
              className="ml-3 text-white hover:text-red-400"
            >
              <MdClose />
            </button>

            {/* Active Tab Indicator */}
            {tab.id === currentRequest.id && (
              <div className="absolute bottom-[0px] left-0 w-full h-[3px] bg-green-500 rounded-b-sm" />
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 ml-3">
        {/* Add Tab Button */}
        <button
          onClick={addNewRequest}
          className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-md transition-all"
        >
          <FiPlus />
        </button>

        {/* Save Button */}
        <button
          onClick={saveRequest}
          className="flex items-center bg-[#2D4263] px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-[#1a2e50] shadow-md transition-all"
        >
          Save <FaRegSave  />
        </button>
      </div>
    </div>
  );
};

export default AddTab;
