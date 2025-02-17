
export const Loader = () => {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center space-x-2">
        <span className="w-10 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
        <span className="w-10 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: "100ms" }}></span>
        <span className="w-10 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></span>
      </div>
    );
  };
  