import { useState, useEffect } from 'react';

function Tabs({ tabsConfig, onActiveTab }) {
  const [activeTab, setActiveTab] = useState(tabsConfig[0].id);
  const [tabHeadWidth, setTabHeadWidth] = useState('100%');
  const handleActiveTab = (id) => {
    onActiveTab(id);
    setActiveTab(id);
  };

  useEffect(() => {
    const calculateWidth = () => {
      const windowWidth = window.innerWidth;
      const tabHeadWidth = `${windowWidth}px`;
      setTabHeadWidth(tabHeadWidth);
    };

    calculateWidth();

    window.addEventListener('resize', calculateWidth);
    return () => {
      window.removeEventListener('resize', calculateWidth);
    };
  }, []);

  return (
    <div className="bg-white mx-auto sm:w-full">
      <div className="border border-gray-300 rounded">
        <div
          className="flex justify-items-center border-gray-300 sticky top-0 bg-white border-b-[1px] z-50"
          style={{ width: tabHeadWidth, overflowX: 'auto', maxWidth: '100%' }}
        >
          <div className="rounded-tl-lg py-3 ml-3">
            {tabsConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleActiveTab(tab.id)}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500 ${activeTab === tab.id ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tab-content">
          {tabsConfig.map((tab) => {
            if (activeTab === tab.id) {
              return <div key={tab.id}>{tab.content()}</div>;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default Tabs;
