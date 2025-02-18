import { RequestContext } from '@/wrappers/RequestWrapper';
import React, { useState, ChangeEvent, useContext, useEffect } from 'react';

interface Param {
  key: string;
  value: string;
  description: string;
}

interface Header {
  key: string;
  value: string;
}

const RequestSender: React.FC = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw Error("error in initializing request context");
  }
  const { currentRequest } = context;

  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
  
  // Initialize state with currentRequest values if they exist
  const [params, setParams] = useState<Param[]>(currentRequest.params || [{ key: '', value: '', description: '' }]);
  const [headers, setHeaders] = useState<Header[]>(currentRequest.headers || [{ key: '', value: '' }]);
  const [body, setBody] = useState<string>(currentRequest.body || '');

  const tabs: string[] = ['Params', 'Headers', 'Body'];

  useEffect(() => {
    // Set the state to the current request when the component mounts
    setParams(currentRequest.params || [{ key: '', value: '', description: '' }]);
    setHeaders(currentRequest.headers || [{ key: '', value: '' }]);
    setBody(currentRequest.body || '');
  }, [currentRequest]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number | null,
    section: 'params' | 'headers' | 'body'
  ) => {
    const { name, value } = e.target;

    if (section === 'params' && index !== null) {
      const newParams = [...params];
      newParams[index][name as keyof Param] = value;
      setParams(newParams);
    } else if (section === 'headers' && index !== null) {
      const newHeaders = [...headers];
      newHeaders[index][name as keyof Header] = value;
      setHeaders(newHeaders);
    } else if (section === 'body') {
      setBody(value);
    }
  };

  const addRow = (section: 'params' | 'headers') => {
    if (section === 'params') {
      setParams([...params, { key: '', value: '', description: '' }]);
    } else if (section === 'headers') {
      setHeaders([...headers, { key: '', value: '' }]);
    }
  };

  return (
    <div style={{ scrollbarWidth: 'none' }} className="flex flex-col p-4 max-h-[400px] overflow-y-scroll bg-[#1e1e1e] text-white">
      <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg">
        <select className="px-3 py-2 bg-gray-700 rounded text-white">
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input
          type="text"
          placeholder="Enter URL or paste text"
          className="flex-grow px-3 py-2 bg-gray-700 rounded text-white outline-none"
        />
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow-md">
          Send
        </button>
      </div>

      <div className="flex gap-6 border-b border-gray-700 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-2 text-lg ${activeTab === tab.toLowerCase() ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-400'}`}
            onClick={() => setActiveTab(tab.toLowerCase() as 'params' | 'headers' | 'body')}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 bg-gray-800 p-4 h-[350px] rounded-lg">
        {activeTab === 'params' && (
          <div>
            {params.map((param, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <input
                  type="text"
                  name="key"
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => handleInputChange(e, index, 'params')}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
                <input
                  type="text"
                  name="value"
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => handleInputChange(e, index, 'params')}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={param.description}
                  onChange={(e) => handleInputChange(e, index, 'params')}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
              </div>
            ))}
            <button
              onClick={() => addRow('params')}
              className="px-4 py-2 mt-2 bg-green-500 hover:bg-green-600 rounded"
            >
              Add Param
            </button>
          </div>
        )}

        {activeTab === 'headers' && (
          <div>
            {headers.map((header, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <input
                  type="text"
                  name="key"
                  placeholder="Key"
                  value={header.key}
                  onChange={(e) => handleInputChange(e, index, 'headers')}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
                <input
                  type="text"
                  name="value"
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) => handleInputChange(e, index, 'headers')}
                  className="px-3 py-2 bg-gray-700 rounded text-white"
                />
              </div>
            ))}
            <button
              onClick={() => addRow('headers')}
              className="px-4 py-2 mt-2 bg-green-500 hover:bg-green-600 rounded"
            >
              Add Header
            </button>
          </div>
        )}

        {activeTab === 'body' && (
          <textarea
            value={body}
            style={{ scrollbarWidth: "none" }}
            onChange={(e) => handleInputChange(e, null, 'body')}
            placeholder="Enter body content"
            rows={7}
            className="w-full  px-3 py-2 bg-gray-700 rounded text-white"
          />
        )}
      </div>
    </div>
  );
};

export default RequestSender;
