import React from "react";
const LoadingIndicator = ({ text = "Loading..." }) => (
  <div className="inline-flex items-center gap-2">
    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    <span>{text}</span>
  </div>
);
export default LoadingIndicator;
