// components/Chip.tsx

import React from "react";

interface ChipProps {
  label: string;
  color: "red" | "green" | "blue";
  onClick?: () => void; // Optional click handler for interaction
}

const Chip = ({ label, color, onClick }: ChipProps) => {
  const colorClasses = {
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <span
      onClick={onClick}
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold transition-all cursor-pointer ${colorClasses[color]}`}
    >
      {label}
    </span>
  );
};

export default Chip;
