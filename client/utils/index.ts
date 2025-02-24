import axios from "axios";
import { IHeader } from "../types";

export async function getSavedRequests() {
    console.log("Fetching history...");

    try {
        const requests = await axios.get("http://localhost:8080/history", {
            withCredentials: true, // Ensures cookies are automatically sent
            headers: {
                "Content-Type": "application/json",
                // Do NOT manually set the Cookie header
            }
        });

        return requests.data;
    } catch (error) {
        console.error("Error fetching saved requests:", error);
        throw error;
    }
}


interface RequestData {
  method: string;
  url: string;
  headers: IHeader[];
  body: string;
}
export async function saveToHistory(request: RequestData): Promise<void> {
    try {
      // Convert `headers: IHeader[]` to `headers: Record<string, string>`
      const formattedHeaders = request.headers.reduce((acc, header) => {
        acc[header.key] = header.value; // Assuming headers have `name` and `value` fields
        return acc;
      }, {} as Record<string, string>);
  
      const formattedRequest = {
        method: request.method,
        url: request.url,
        headers: formattedHeaders, // Converted headers
        body: request.body,
      };
  
      const response = await axios.post(
        "http://localhost:8080/history/save",
        formattedRequest,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Request saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving request to history:", error);
      throw error;
    }
  }
  