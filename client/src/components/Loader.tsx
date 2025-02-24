export const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <span className="w-10 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
      <span className="w-10 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: "100ms" }}></span>
      <span className="w-10 h-10 bg-white rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></span>
    </div>
  );
};
