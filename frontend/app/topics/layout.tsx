import React from "react";

const TopicsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div>From Layout</div>
      {children}
    </div>
  );
};

export default TopicsLayout;
