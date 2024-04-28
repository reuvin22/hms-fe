import { useEffect, useState } from 'react';

const initialRow = {
  date_time: '',
  nurse_notes: [
    {
      remarks: '',
      ivfluids: '',
      vitals: ''
    }
  ]
};

function NurseNote({ data, onModalState }) {
  // const initialRow = nurseNoteForm.reduce((acc, item) => {
  //     acc[item.tdName] = ""
  //     return acc
  // }, {})

  const [hoveringOverTh, setHoveringOverTh] = useState(false);
  const [activeTab, setActiveTab] = useState('tab1');

  const transformDataToRowFormat = (data) => {
    // Transform the available data into the expected row format
    // return data.nurse_notes.map(note => ({
    //     nurse_notes: [
    //         {
    //             remarks: note.remarks || '',
    //             ivfluids: note.ivfluids || '',
    //             vitals: note.vitals || '',
    //         }
    //     ],
    // }))
  };

  const [rows, setRows] = useState([initialRow]);

  const nurseNoteData = [
    ...data.nurse_notes.map((item) => ({
      type: 'remarks',
      description: 'Notes',
      content: item.remarks
    })),
    ...data.ivfluids.map((item) => ({
      type: 'ivfluids',
      description: 'IVF',
      content: `${item.bottle_no} • ${item.type_of_iv} • ${item.volume} • ${item.rate_of_flow}`
    })),
    ...data.vitals.map((item) => ({
      type: 'vitals',
      description: 'Vitals',
      content: `${item.temp} ℃ • ${item.bp} mmHg`
    }))
  ];

  const handleAddRow = () => {
    setRows((rows) => [...rows, { ...initialRow }]);
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleOnClick = () => {
    onModalState({ modalState: true, type: 'nsn', modalType: 'nurses-notes' });
  };

  const hasData =
    data.nurse_notes.length > 0 ||
    data.ivfluids.length > 0 ||
    data.vitals.lenght > 0;

  const renderTableCell = (tdName, row) => {
    console.log(nurseNoteData[0] !== null);
    switch (tdName) {
      case 'date_time':
        return (
          <span className="bg-gray-300 rounded p-2 text-xs">
            {row[tdName] || new Date().toLocaleString()}{' '}
          </span>
        );

      case 'nurse_notes':
        return (
          <div>
            <div
              onClick={handleOnClick}
              className="border-none space-y-2 w-full focus:border-gray-500 focus:outline-none hover:cursor-pointer"
            >
              {/* {row.nurse_notes.length > 0 ? (
                                row.nurse_notes.map((note, noteIndex) => (
                                    <div key={noteIndex} className="p-4 rounded bg-gray-200 cursor-pointer text-sm text-gray-500 hover:text-gray-800">
                                        <p><span className="text-green-700 font-bold" key={noteIndex[0]}>Remarks:</span> {note.remarks} </p>
                                        <p><span className="text-green-700 font-bold" key={noteIndex[1]}>IVF:</span> {note.ivfluids} </p>
                                        <p><span className="text-green-700 font-bold" key={noteIndex[2]}>Vital Sign:</span> {note.vitals} </p>
                                    </div>
                                ))
                            ) : (
                                <p className="py-4 text-gray-400">Click to fill...</p>
                            )} */}

              {/* {nurseNoteData.length > 0 ? (
                                nurseNoteData.map((item, index) => (
                                    <div key={index} className="p-4 rounded bg-gray-200 cursor-pointer text-sm text-gray-500 hover:text-gray-800">
                                        <p><span className="text-green-700 font-bold">{item.description}:</span> {item.content}</p>
                                    </div>
                                ))
                            ): (
                                <p className="py-4 text-gray-400">Click to fill...</p>
                            )} */}
            </div>
          </div>
        );
      default:
    }
  };

  return (
    <div>
      <table className="border-none min-w-full divide-y divide-gray-200">
        <thead>
          <tr
            onMouseEnter={() => setHoveringOverTh(true)}
            onMouseLeave={() => setHoveringOverTh(false)}
            className="hover:cursor-pointer"
          >
            <th
              className={`${hoveringOverTh ? 'bg-green-200' : 'bg-white'} px-6 py-3 text-left text-xs font-normal text-gray-500 uppercase tracking-wider`}
            >
              Date/Time
            </th>
            <th
              className={`${hoveringOverTh ? 'bg-green-200' : 'bg-white'} px-6 py-3 text-left text-xs font-normal text-gray-500 uppercase tracking-wider`}
            >
              Nurses Notes
            </th>
            {hoveringOverTh && (
              <button
                onClick={handleAddRow}
                title="Add Row"
                className="flex justify-center bg-green-200 hover:bg-green-300 absolute p-2 -translate-x-10 text-gray-500 hover:text-white"
              >
                <svg
                  dataSlot="icon"
                  fill="none"
                  className="w-6 h-6 "
                  strokeWidth={1.5}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            )}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {console.log(row)}
              <td className="text-left px-4 border-r border-b border-gray-300 w-48">
                {renderTableCell('date_time', row)}
              </td>
              <td className="text-left p-2 border-r border-b border-gray-300">
                {renderTableCell('nurse_notes', row)}
              </td>
              {/* {nurseNoteForm.map((item) => (
                                
                            ))} */}
              {rows?.length > 1 && (
                <td className="w-10 hover:bg-gray-200">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(rowIndex)}
                    className=" rounded-md focus:outline-none text-[#cb4949] p-2 min-h-full"
                  >
                    <svg
                      fill="none"
                      className="h-6 w-6"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NurseNote;
