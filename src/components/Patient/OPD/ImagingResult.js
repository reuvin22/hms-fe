import React from 'react';

function ImagingResult({ slug, tableData, tableHeader }) {
  const header = [
    'test_name',
    'imaging_src',
    'comparison',
    'indication',
    'findings',
    'impressions'
  ];
  const filteredHeader = tableHeader?.filter((field) => header.includes(field));
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {filteredHeader?.map((tblHeader, tblHeaderIndex) => (
            <th
              key={tblHeaderIndex}
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {tblHeader}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {tableData?.length === 0 ? (
          <tr>
            <td
              colSpan={tableHeader?.length + 1}
              className="px-6 py-2 text-center"
            >
              No records found.
            </td>
          </tr>
        ) : (
          tableData?.map((tblBody, tblBodyIndex) => (
            <tr key={tblBody.id} className="hover:bg-gray-200">
              {filteredHeader.map((tblHeader) => (
                <td
                  key={tblHeader}
                  className="px-6 py-2 whitespace-nowrap text-sm"
                >
                  {tblBody[tblHeader] !== null ? tblBody[tblHeader] : 'Pending'}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default React.memo(ImagingResult);
