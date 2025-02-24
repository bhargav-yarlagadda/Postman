import React from "react";

interface RequestData {
  method: string;
  url: string;
  headers: Record<string, string> | null;
  body: string;
  timestamp: string;
}

const RequestViewer: React.FC<{ request: RequestData }> = ({ request }) => {
  // Convert timestamp to a readable format
  const formattedDate = new Date(request.timestamp).toLocaleDateString();
  const formattedTime = new Date(request.timestamp).toLocaleTimeString();

  return (
    <div
    style={{scrollbarWidth:"none"}}
    className="p-6 w-[90%] h-[300px] overflow-y-scroll rounded-lg shadow-lg bg-gray-900 text-gray-100 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Request Details</h2>

      <div className="space-y-3 text-sm">
        <p>
          <span className="font-medium text-gray-400">Date:</span>{" "}
          <span className="text-yellow-300">{formattedDate}</span>
        </p>
        <p>
          <span className="font-medium text-gray-400">Time:</span>{" "}
          <span className="text-yellow-300">{formattedTime}</span>
        </p>
        <p>
          <span className="font-medium text-gray-400">Method:</span>{" "}
          <span className="text-blue-300">{request.method}</span>
        </p>
        <p>
          <span className="font-medium text-gray-400">URL:</span>{" "}
          <span className="text-green-300 break-all">{request.url}</span>
        </p>
        <div>
          <span className="font-medium text-gray-400">Headers:</span>
          <pre className="bg-gray-800 p-2 rounded text-gray-300 mt-1 overflow-auto max-h-40">
            {request.headers ? JSON.stringify(request.headers, null, 2) : "None"}
          </pre>
        </div>
        <div>
          <span className="font-medium text-gray-400">Body:</span>
          <pre className="bg-gray-800 p-2 rounded text-gray-300 mt-1 overflow-auto max-h-40">
            {request.body || "No body"}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RequestViewer;
