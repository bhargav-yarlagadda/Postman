'use client'

import React, { useState, createContext } from "react";

interface IParams {
  key: string;
  value: string;
  description: string;
}

interface IHeader {
  key: string;
  value: string;
  description: string;
}

export interface Request {
  method: "GET" | "POST" | "DELETE" | "PUT";
  url: string;
  params: IParams[];
  headers: IHeader[];
  body: string;
}

// Corrected context type as an object
interface RequestContextType {
  requests: Request[]; // Array of requests
  setRequests: React.Dispatch<React.SetStateAction<Request[]>>; // Setter function for requests
  currentRequest: Request; // Current request
  setCurrentRequest: React.Dispatch<React.SetStateAction<Request>>; // Setter function for current request
}

export const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [requests, setRequests] = useState<Request[]>([{ method: "GET", url: "", params: [], headers: [], body: "" }]);
  const [currentRequest, setCurrentRequest] = useState<Request>({ method: "GET", url: "", params: [], headers: [], body: "" });

  return (
    <RequestContext.Provider value={{ requests, setRequests, currentRequest, setCurrentRequest }}>
      {children}
    </RequestContext.Provider>
  );
};
