import React from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useServiceWorker } from "../hooks/useServiceWorker";

const NetworkStatus = () => {
  const { isOnline, isInstalled, updateSW } = useServiceWorker();

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
        <WifiOff size={16} />
        <span className="text-sm">Không có kết nối</span>
      </div>
    );
  }

  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
        <Wifi size={16} />
        <span className="text-sm">Đã kết nối</span>
        <button
          onClick={updateSW}
          className="ml-2 p-1 hover:bg-green-600 rounded transition-colors"
          title="Cập nhật ứng dụng"
        >
          <RefreshCw size={12} />
        </button>
      </div>
    );
  }

  return null;
};

export default NetworkStatus;
