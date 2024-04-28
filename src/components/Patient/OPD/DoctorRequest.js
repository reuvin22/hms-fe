import { useComponentContext } from '@/utils/context';
import React, { useEffect, useState } from 'react';

const frequencyOptions = [
  'once a day',
  'twice a day',
  'every other day',
  'every 12 hours'
];

const formMedication = [
  'tablets',
  'capsules',
  'spansules',
  'liquid',
  'softgels'
];

function DoctorRequest() {
  const context = useComponentContext();
  const [openCategory, setOpenCategory] = useState(null);

  const renderMedication = () => (
    <div className="flex justify-center">
      <div className="flex-col w-full border scroll-custom">
        <div className="overflow-y-auto scroll-custom">
          {!context?.state.isShowMedForm && (
            <div className="sticky top-0">
              <input
                type="search"
                value={context?.state.searchMedicine}
                onChange={(e) =>
                  context?.onChange({
                    type: 'searchMedQuery',
                    value: e.target.value
                  })
                }
                placeholder="Search..."
                className="p-1 w-full border border-gray-300 bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
              />
              <div className="">
                {context?.medicationData?.map((data) => (
                  <div
                    key={data.id}
                    className={`p-2 text-sm text-gray-500 ${data?.status === 'ps' ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-300 cursor-pointer'}`}
                    onClick={
                      data?.status !== 'ps'
                        ? () => context?.onClickOpenMed(data)
                        : undefined
                    }
                  >
                    {`${data?.medicine.generic_name} (${data?.dose})`}
                  </div>
                ))}
              </div>
            </div>
          )}

          {context?.state.isShowMedForm && (
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Brand name:
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                  value={context?.state?.selectedMedicine?.medicine.brand_name}
                  readOnly
                />
                <label className="block text-sm font-medium text-gray-700">
                  Generic name:
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                  value={
                    context?.state?.selectedMedicine?.medicine.generic_name
                  }
                  readOnly
                />

                <label className="block text-sm font-medium text-gray-700">
                  Dose:
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
                  value={context?.state?.selectedMedicine?.dose}
                  onChange={(e) =>
                    context?.onAddMedicine({ data: e, field: 'dose' })
                  }
                />

                <label className="block text-sm font-medium text-gray-700">
                  Form:
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 mr-4 focus:outline-none focus:border-gray-500 text-sm"
                  value={context?.state?.selectedMedicine?.form || ''}
                  onChange={(e) =>
                    context?.onAddMedicine({ data: e, field: 'form' })
                  }
                >
                  <option>Select options</option>
                  {formMedication.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700">
                  Qty:
                </label>
                <input
                  type="number"
                  className={`mt-1 block w-full p-2 border bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500 ${context?.alertMessage !== '' ? 'border-red-600' : 'border-gray-300'}`}
                  value={context?.state?.selectedMedicine?.qty}
                  onChange={(e) =>
                    context?.onAddMedicine({ data: e, field: 'qty' })
                  }
                />
                {context?.alertMessage && (
                  <p className="text-xs text-red-600">
                    <span class="font-medium">Error!</span>{' '}
                    {context?.alertMessage}
                  </p>
                )}

                <label className="block text-sm font-medium text-gray-700">
                  Frequency:
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 mr-4 focus:outline-none focus:border-gray-500 text-sm"
                  value={context?.state?.selectedMedicine?.frequency || ''}
                  onChange={(e) =>
                    context?.onAddMedicine({ data: e, field: 'frequency' })
                  }
                >
                  <option>Select options</option>
                  {frequencyOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700">
                  Sig:
                </label>
                <textarea
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
                  value={context?.state?.selectedMedicine?.sig}
                  onChange={(e) =>
                    context?.onAddMedicine({ data: e, field: 'sig' })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => context?.onClose({ type: 'backToList' })}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  &larr; Back
                </button>
                <button
                  onClick={() =>
                    context?.onSubmitData({
                      link: 'add-medicine',
                      qty: context?.state?.selectedMedicine?.qty,
                      id: context?.state?.selectedMedicine?.id
                    })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-col w-full h-58 border border-l-gray-500">
        <div className="overflow-y-auto scroll-custom h-full">
          {context?.state.addedMedicine.map((data, index) => (
            <div
              key={data.id}
              className="p-2 hover:bg-gray-200 cursor-pointer text-sm text-gray-500"
              // onClick={() => moveItemToLeft(item.id)}
            >
              {`${data?.medicine.generic_name} (${data.dose})`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div
        className={`fixed inset-0 top-0 p-4 bg-black opacity-50 transition-opacity ${context?.isDrDrawerOpen ? 'visible' : 'hidden'}`}
      />
      <div
        className={`fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto bg-white w-[30%] transition-transform duration-500 ease-in-out ${context?.isDrDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <h5 class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
          <svg
            class="w-4 h-4 me-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          Doctor's Request
        </h5>
        <button
          onClick={() => context?.onClose({ type: 'closeMenu' })}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center"
        >
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>

        <div className="pt-7">
          {Object.entries(context?.pathologyData).map(([category, tests]) => (
            <div key={category} className="border border-gray-400">
              <div className="bg-gray-200">
                <button
                  onClick={() =>
                    setOpenCategory(openCategory === category ? null : category)
                  }
                  className="text-gray-500 font-medium p-2 uppercase text-xs"
                >
                  {category}
                </button>
              </div>

              <div
                style={{
                  display: openCategory === category ? 'block' : 'none'
                }}
                className="p-4"
              >
                <ul className="space-y-1">
                  {tests.map((test) => (
                    <li key={test.id}>
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          className="w-3 h-3"
                          onChange={(e) =>
                            context?.onCheck({
                              type: test,
                              event: e.target.checked,
                              category: 'pathology'
                            })
                          }
                        />
                        <p className="text-sm text-gray-500">
                          {test.test_name}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="border border-gray-400">
            <div className="bg-gray-200">
              <p className="text-gray-500 font-medium p-2 uppercase text-xs">
                Imaging
              </p>
            </div>

            <ul className="space-y-1 p-4">
              {context?.radiologyData?.map((test) => (
                <li key={test.id}>
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      onChange={(e) =>
                        context?.onCheck({
                          type: test,
                          event: e.target.checked,
                          category: 'radiology'
                        })
                      }
                    />
                    <p className="text-sm text-gray-500">{test.test_name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid justify-items-center py-4">
            <button
              onClick={() =>
                context?.onSubmitDrRequest({ slug: 'doctor-request' })
              }
              className={`${context?.state.isOptionDisabled || context?.state.btnSpinner ? 'bg-gray-300' : 'bg-emerald-500 hover:bg-emerald-600'} flex items-center text-white text-sm px-2 py-1 gap-2 rounded focus:outline-none`}
              disabled={
                context?.state.isOptionDisabled || context?.state.btnSpinner
              }
            >
              {context?.state.btnSpinner ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 animate-spin"
                  viewBox="0 0 100 100"
                  fill="none"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="32"
                    stroke-width="8"
                    stroke="currentColor"
                    strokeDasharray="50.26548245743669 50.26548245743669"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  fill="none"
                  stroke="currentColor"
                  className="h-6 w-6"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              )}
              Submit
            </button>
          </div>

          <div className="border border-gray-400 ">
            <div className="bg-gray-200">
              <p className="text-gray-500 font-medium p-2 uppercase text-xs">
                Medications
              </p>
            </div>

            {renderMedication()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DoctorRequest);
