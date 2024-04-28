import { useState, useEffect, useContext } from 'react';
import { useBigCalendarContext } from '@/utils/context';

function BigCalendar() {
  const context = useBigCalendarContext();
  const formattedDate = new Date().toISOString().split('T')[0];
  const [activeTab, setActiveTab] = useState('tab1');
  const [activeDate, setActiveDate] = useState(formattedDate);

  const headers = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const handleDateChange = (event) => {
    setActiveDate(event.target.value);
  };

  console.log(activeDate);

  return (
    <>
      <div className="flex justify-between">
        <div className="rounded-tl-lg py-3 ml-3">
          {activeTab === 'tab1' && (
            <input
              type="date"
              id="pickDate"
              value={activeDate}
              onChange={handleDateChange}
              className="bg-zinc-100 border-gray-200 hover:bg-zinc-200 focus:outline-none font-medium bg-white text-gray-500 uppercase text-sm rounded-md p-4"
            />
          )}

          {activeTab === 'tab2' && (
            <>
              <input
                type="date"
                id="pickDate"
                // value={}
                // onChange={}
                className="bg-zinc-100 focus:outline-none font-medium bg-white text-gray-500 uppercase text-sm rounded-md p-4"
              />

              <span className="font-medium text-sm text-center text-gray-500 py-2 px-3">
                to
              </span>

              <input
                type="date"
                id="pickDate"
                // value={}
                // onChange={}
                className="bg-zinc-100 focus:outline-none font-medium bg-white text-gray-500 uppercase text-sm rounded-md p-4"
              />
            </>
          )}

          {activeTab === 'tab3' && (
            <input
              type="month"
              id="pickDate"
              // value={}
              // onChange={}
              className="bg-zinc-100 focus:outline-none font-medium bg-white text-gray-500 uppercase text-sm rounded-md p-4"
            />
          )}
        </div>

        <div className="flex">
          <div className="rounded-tl-lg py-3 ml-3 px-3">
            <button
              onClick={() => setActiveTab('tab1')}
              className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
            >
              Day
            </button>
            <button
              onClick={() => setActiveTab('tab2')}
              className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
            >
              Week
            </button>
            <button
              onClick={() => setActiveTab('tab3')}
              className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
            >
              Month
            </button>
          </div>
        </div>
      </div>
      <hr className="drop-shadow-md" />

      {/* Day Tab View*/}
      {activeTab === 'tab1' && (
        <>
          <div className="min-h-[500px]">
            <div className="flex">
              <div className="min-w-[168px] border-r">
                <p className="font-medium text-sm text-gray-500 py-2 px-3">
                  Time
                </p>
                <hr className="drop-shadow-md" />
              </div>

              <div className="w-full">
                <p className="font-medium text-sm text-gray-500 py-2 px-3">
                  Agenda
                </p>
                <hr />
              </div>
            </div>

            {context.calendarData &&
            context.calendarData.filter(
              (item) => item.appointment_date.split(' ')[0] === activeDate
            ).length > 0 ? (
              <div>
                {context.calendarData
                  .filter(
                    (item) => item.appointment_date.split(' ')[0] === activeDate
                  )
                  .map((item) => (
                    <div
                      onClick={() => context?.onClick('editUserBtn', item)}
                      key={item.id}
                      className={`flex bg-${item.appointment_color.toLowerCase()}-100 cursor-pointer hover:bg-${item.appointment_color.toLowerCase()}-200`}
                    >
                      <div className={`min-w-[168px] border-r`}>
                        <p className="font-medium text-sm text-gray-500 py-2 px-3">
                          {new Date(
                            `2000-01-01T${item.appointment_date.split(' ')[1]}`
                          ).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <hr />
                      </div>
                      <div className={`w-full`}>
                        <div className="flex">
                          <p className="text-sm text-gray-500 py-2 px-3">
                            {item.doctors_agenda}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="0.5"
                            stroke="currentColor"
                            className="w-6 h-6 my-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                            />
                          </svg>
                          <p className="text-sm text-gray-400 py-2 px-3">
                            {item.patient_name}
                          </p>
                        </div>
                        <hr />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div>
                <p className="text-md text-gray-400 text-center py-2 px-3">
                  No records found
                </p>
                <hr />
              </div>
            )}
          </div>
        </>
      )}
      {/* End of Day Tab View*/}

      {/* Week Tab View*/}
      {activeTab === 'tab2' && (
        <>
          <div className="grid grid-cols-7 divide-x min-h-[500px]">
            {headers.map((day) => (
              <div>
                <p className="font-medium text-sm text-center text-gray-500 py-2 px-3">
                  {day}
                </p>
                <hr className="drop-shadow-md pb-5" />
              </div>
            ))}
          </div>
        </>
      )}
      {/* End of Week Tab View */}

      {/* Month Tab View*/}
      {activeTab === 'tab3' && (
        <>
          <div className="grid grid-cols-7 divide-x min-h-[500px]">
            {headers.map((day) => (
              <div>
                <p className="font-medium text-sm text-center text-gray-500 py-2 px-3">
                  {day}
                </p>
                <hr className="drop-shadow-md pb-5" />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default BigCalendar;
