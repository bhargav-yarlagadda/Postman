# Postman Clone

A full-stack post-man clone built using **Next.js** for the frontend and **Go Fiber** for the backend.

## 🚀 Tech Stack

### Frontend:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Backend:
- [Go Fiber](https://gofiber.io/)
- [MONGO DB]

---

## 📌 Features
## 🔹 Authentication & Sessions  
- 🔐 **User Authentication** – Implement Signup/Login functionality using JWT.  
- 🍪 **User Sessions** – Manage user sessions securely using cookies for authentication.  
- ✅ **Send HTTP Requests** – Support for GET, POST, PUT, DELETE, PATCH, etc.  
- ✅ **Request Headers & Body** – Allow users to add custom headers, parameters, and body (JSON, form-data, raw, etc.).  
- ✅ **Response Viewer** – Display response status, headers, and body in JSON, XML, or plain text format.  
- ✅ **Error Handling** – Show detailed error messages for failed requests (e.g., timeouts, bad requests). 


---

# 📂 Project Structure

```bash
postman/
│── client/ (Next.js)
    │── src/ (Next.js)
    ├── components/       # Reusable UI components
    ├── app/               # App logic
    ├── wrapper/          # Context
    ├── package.json      # Frontend dependencies
    ├── next.config.js    # Next.js configuration
    └── tsconfig.json     # TypeScript configuration (if using TS)

│── server/ (Go Fiber)
│   ├── auth/      # API request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Middleware functions
│   ├── database/         # Database connection setup
│   ├── main.go           # Entry point for backend server
│   ├── go.mod            # Go module dependencies
│   └── go.sum            # Go module checksums
│
└── README.md             # Project documentation
```

---

## 🔹 Running the Frontend (Next.js)  

```bash
cd client  # Navigate to the frontend directory
npm install  # Install dependencies
npm run dev  # Start the development server
```
## 🔹 Running the Backend (Go Fiber)  

```bash
cd backend  # Navigate to the backend directory
go mod tidy  # Install dependencies
go run main.go  # Start the backend server
```