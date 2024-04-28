function Transaction() {
  return (
    <>
      <div className="px-2 mb-4">
        <span class="text-xl font-medium uppercase text-[#90949a]">
          Transaction History
        </span>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* {data.map((row, index) => ( */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-[#676a6e]">
                TRX-23-0001
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[#676a6e]">
                Nurse Jane created appointment to Dr Joe
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[#676a6e]">
                Pending
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-[#676a6e]">
                October 20 2023
              </td>
              {/* Add more cells for each row/column data */}
            </tr>
            {/* ))} */}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Transaction;
