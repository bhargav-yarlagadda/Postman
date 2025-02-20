import React from "react";

export const Toast = ({ message, onClose }:{message:string,onClose:React.MouseEventHandler<HTMLButtonElement>}) => {
    return (
      <div className="w-full overflow-hidden absolute top-10 left-0 flex justify-center items-center">
              <div className=" bg-red-500 text-white px-4 py-2 rounded shadow-md animate-slide-in">
          {message}
          <button onClick={onClose} className="ml-4 text-white font-bold">X</button>
        </div>
      </div>
    );
  };
  