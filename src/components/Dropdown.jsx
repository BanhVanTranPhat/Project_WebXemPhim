import React, { useRef, useEffect, useState } from "react";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Toggle Dropdown
      </button>
      {isOpen && (
        <div className="absolute bg-white border rounded shadow-lg mt-2">
          <ul>
            <li className="p-2 hover:bg-gray-200">Option 1</li>
            <li className="p-2 hover:bg-gray-200">Option 2</li>
            <li className="p-2 hover:bg-gray-200">Option 3</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
