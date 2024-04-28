function Pagination({ currentPage, totalPages, onPageChange }) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      // console.log(newPage)
      onPageChange(newPage);
    }
  };

  return (
    <div>
      <nav>
        <ul className="flex rounded list-none flex-wrap gap-1">
          <li>
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={isFirstPage}
              className={`${isFirstPage ? 'cursor-not-allowed' : 'cursor-pointer'} bg-white border border-gray-300 hover:bg-gray-400 p-1 hover:text-white rounded-md text-gray-500`}
            >
              <svg
                fill="none"
                className="w-[22px]"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          </li>

          {/* First Page */}
          <li>
            <button
              onClick={() => handlePageChange(1)}
              className={`${currentPage === 1 ? 'bg-gray-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-300'} text-sm w-8 h-8 rounded-md`}
            >
              1
            </button>
          </li>
          {/* {console.log(currentPage)} */}
          {currentPage > 3 && <li className="self-center mx-2">...</li>}

          {[currentPage - 1, currentPage, currentPage + 1]
            .filter((page) => page > 1 && page < totalPages)
            .map((page) => (
              <li key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  className={`${currentPage === page ? 'bg-gray-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-300'} text-sm w-8 h-8 rounded-md`}
                >
                  {page}
                </button>
              </li>
            ))}

          {currentPage < totalPages - 2 && (
            <li className="self-center mx-2">...</li>
          )}

          {/* Last Page */}
          {totalPages !== 1 && (
            <li>
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`${currentPage === totalPages ? 'bg-gray-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-300'} text-sm p-1 w-8 h-8 rounded-md`}
              >
                {totalPages}
              </button>
            </li>
          )}

          <li>
            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={isLastPage}
              className={`${isLastPage ? 'cursor-not-allowed' : 'cursor-pointer'} bg-white border border-gray-300 hover:bg-gray-400 p-1 text-sm rounded-md text-[#676a6e]`}
            >
              <svg
                fill="none"
                className="w-[22px]"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
