import { useState, Fragment, useEffect } from 'react';

import CustomCKEditor from './CustomCKEditor';

function NavTab({ tabsData, modal, tables, userId, onClose, onCheckedData }) {
  const [activeTab, setActiveTab] = useState(1);
  const [checkedItem, setCheckedItem] = useState([]);

  // useEffect(() => {
  //     onCheckedData(checkedItem)
  // }, [checkedItem, onCheckedData])

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleCheckbox = (moduleId) => {
    if (checkedItem.includes(moduleId)) {
      setCheckedItem(checkedItem.filter((checked) => checked !== moduleId));
      // onCheckedData([...checkedItem])
    } else {
      setCheckedItem([...checkedItem, moduleId]);

      // onCheckedData([...checkedItem])
    }
  };
  // console.log(userId[0])

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border rounded-lg">
          <div className="flex justify-items-center">
            {tabsData.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(index + 1)}
                className={`px-4 py-2 ${
                  activeTab === index + 1 ? 'bg-white' : 'bg-gray-200'
                } ${index === 0 ? 'rounded-tl-lg' : ''}  border-b-2 focus:outline-none font-medium uppercase text-sm text-gray-500`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {tabsData.map((tab, index) => (
            <Fragment key={index}>
              {activeTab === index + 1 && (
                <div className="tab-content p-2">
                  {modal && Array.isArray(tab.content) && (
                    <ul className="space-y-4 max-h-80 overflow-y-auto divide-y">
                      {tab.content.map((item) => (
                        <li key={item.module_id}>
                          <div className="flex items-center space-x-4 p-4 ">
                            <input
                              type="checkbox"
                              className="w-5 h-5"
                              name={`grant_${item.module_id}`}
                              value={item.module_id}
                              checked={checkedItem.includes(item.module_id)}
                              onChange={() => handleCheckbox(item.module_id)}
                            />
                            <p className="text-lg text-gray-500">{item.name}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {tab.content !== '' && (
                    <div className="text-lg text-gray-500">{tab.content}</div>
                  )}

                  {tab.ckeditor && (
                    <>
                      <CustomCKEditor {...tab.ckeditorProps} />
                      {tab.ckeditorProps}
                      <button>Save</button>
                    </>
                  )}

                  {/* { modal && Array.isArray(tab.content) ? (
                                        <ul className="space-y-4 max-h-80 overflow-y-auto divide-y">
                                            {tab.content.map((item) => (
                                                
                                                <li key={item.module_id}>
                                                    <div className="flex items-center space-x-4 p-4 ">
                                                        <input
                                                            type="checkbox" 
                                                            className="w-5 h-5"
                                                            name={`grant_${item.module_id}`}
                                                            value={item.module_id}
                                                            checked={checkedItem.includes(item.module_id)}
                                                            onChange={() => handleCheckbox(item.module_id)}
                                                        />
                                                        <p className="text-lg text-gray-500">{item.name}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-lg text-gray-500">{tab.content}</div>
                                    )} */}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <hr className="py-8" />
      {tables && (
        <div>
          {tabsData.map(
            (tab, index) =>
              tab.table && (
                <Fragment key={index}>
                  {activeTab === index + 1 && (
                    <div className="px-2 mb-4">
                      <span class="text-xl font-medium uppercase text-[#90949a]">
                        {tab.tableTitle}
                      </span>
                    </div>
                  )}
                  {activeTab === index + 1 && tab.tableContent}
                </Fragment>
              )
          )}
        </div>
      )}
    </>
  );
}

export default NavTab;
