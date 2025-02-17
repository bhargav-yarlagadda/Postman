"use client";

import { FiPlus } from "react-icons/fi";
import React from "react";
import { useState } from "react";
import { FaRegSave } from "react-icons/fa";

interface TabType {
  [name: string]: string;
}

const AddTab = () => {
  const [tabs, setTabs] = useState<TabType[]>([{ name: "test" }]);
  return (
    <div className="flex items-center w-full bg-gray-900 py-2 px-3">
      <div className="flex w-[95%] overflow-x-scroll " style={{scrollbarWidth:"none"}}>
        {tabs.map((tab: any, index: number) => (
          <div
            key={index}
            className="max-w-[120px] w-full px-3 py-2 text-sm text-white bg-[#2D4263] rounded-sm shadow-md me-3 truncate"
          >
            {tab?.name}
          </div>
        ))}
        <button
          onClick={() => {
            setTabs((prev) => [...prev, { name: "New Request" }]);
          }}
          className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow-md transition-all duration-300 ease-in-out"
        >
          <FiPlus />
        </button>
      </div>
      <button className="bg-[#2D4263] flex items-center justify-between px-3 hover:bg-[#1a2e50] text-white w-20 py-2 text-md rounded-[3px]">save <FaRegSave/></button>
    </div>
  );
};

export default AddTab;
