export interface IParams {
  key: string;
  value: string;
  description: string;
}

export interface IHeader {
  key: string;
  value: string;
  description: string;
}
export interface Request {
  id: string; // UUID as a string
  method: "GET" | "POST" | "DELETE" | "PUT";
  url: string;
  params: IParams[];
  headers: IHeader[];
  body: string;
}