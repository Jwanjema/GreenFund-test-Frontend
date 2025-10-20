import React, { useState } from 'react';

function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="w-full mt-8">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-300">
        {React.Children.map(children, (child, index) => (
          <button
            key={index}
            className={`py-2 px-6 font-semibold text-lg ${
              activeTab === index
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => handleTabClick(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
}

// This is a simple wrapper component for tab content
function TabPanel({ children, label }) {
  return <div>{children}</div>;
}

export { Tabs, TabPanel };