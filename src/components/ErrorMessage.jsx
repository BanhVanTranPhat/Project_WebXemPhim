import React from "react";
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p className="text-gray-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);
export default ErrorMessage;
