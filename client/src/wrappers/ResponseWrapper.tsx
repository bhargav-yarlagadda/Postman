import React, { createContext, useState } from 'react';

export interface IHeader {
  key: string;
  value: string;
}

export interface Response {
  statusCode: string;
  statusMsg: string;
  body: string;
  headers: IHeader[];
  cookies: string;
}

interface ResponseContextType {
  response: Response | null;
  setResponse: React.Dispatch<React.SetStateAction<Response | null>>;
}

export const ResponseContext = createContext<ResponseContextType | undefined>(undefined);

const ResponseWrapper = ({ children }: { children: React.ReactNode }) => {
  const [response, setResponse] = useState<Response | null>(null);

  return (
    <ResponseContext.Provider value={{ response, setResponse }}>
      {children}
    </ResponseContext.Provider>
  );
};

export default ResponseWrapper;
