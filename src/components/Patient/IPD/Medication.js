import { useComponentContext, useModalContext } from '@/utils/context';
import React, { useState } from 'react';
import { useDeleteDataMutation } from '@/service/patientService';

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

function Medication() {
  const componentContext = useComponentContext();
  const modalContext = useModalContext();

  const handleOnDelete = (index) => {
    componentContext?.onRemoveData({
      slug: 'remove-row-medication',
      id: index
    });
  };

  return (
    <div className="flex justify-center">
      <div className="flex-col w-96">
        {!modalContext?.state?.isShowMedForm && (
          <div className="sticky top-0">
            <input
              type="search"
              value={modalContext?.state?.searchMedicine}
              onChange={(e) =>
                modalContext?.onChange({
                  type: 'searchMedQuery',
                  value: e.target.value
                })
              }
              placeholder="Search..."
              className="p-1 w-full border-b-gray-300 border-b-[1px] bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
            />
            <div className="">
              {modalContext?.state?.medicineList
                ?.filter((medicine) => {
                  return modalContext?.state?.searchMedicine === ''
                    ? medicine
                    : medicine.generic_name.includes(
                        modalContext?.state?.searchMedicine
                      );
                })
                ?.map((data) => (
                  <div
                    key={data.id}
                    className={`p-2 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-800 ${data.quantity === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={
                      data.quantity === 0
                        ? undefined
                        : () =>
                            modalContext?.onClickOpenMed({
                              data,
                              field: 'selectMedicine'
                            })
                    }
                  >
                    <p
                      className={`${data.quantity === 0 ? 'text-red-500' : ''}`}
                    >{`${data.generic_name} ${data.quantity === 0 ? '(Out of stock)' : ''}`}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {modalContext?.state?.isShowMedForm && (
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Brand name:
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                value={modalContext?.state?.selectedMedicine?.brand_name}
                readOnly
              />
              <label className="block text-sm font-medium text-gray-700">
                Generic name:
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                value={modalContext?.state?.selectedMedicine?.generic_name}
                readOnly
              />

              <label className="block text-sm font-medium text-gray-700">
                Dose:
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                value={modalContext?.state?.selectedMedicine?.dosage}
                readOnly
              />

              <label className="block text-sm font-medium text-gray-700">
                Form:
              </label>
              <select
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mr-4 focus:outline-none focus:border-gray-500 text-sm"
                onChange={(e) =>
                  modalContext?.onAddMedicine({ data: e, field: 'form' })
                }
              >
                <option>Select options</option>
                {modalContext?.state?.medicineForm?.map((option, index) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-700">
                Qty:
              </label>
              <input
                type="number"
                className={`mt-1 block w-full p-2 border bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500 ${modalContext?.state?.alertMessage !== '' ? 'border-red-600' : 'border-gray-300'}`}
                value={modalContext?.state?.selectedMedicine?.qty}
                onChange={(e) =>
                  modalContext?.onAddMedicine({ data: e, field: 'qty' })
                }
              />
              {modalContext?.state?.alertMessage && (
                <p className="text-xs text-red-600">
                  <span class="font-medium">Error!</span>{' '}
                  {modalContext?.state?.alertMessage}
                </p>
              )}

              <label className="block text-sm font-medium text-gray-700">
                Frequency:
              </label>
              <select
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mr-4 focus:outline-none focus:border-gray-500 text-sm"
                onChange={(e) =>
                  modalContext?.onAddMedicine({ data: e, field: 'frequency' })
                }
              >
                <option>Select options</option>
                {modalContext?.state?.medicineFrequency.map((option, index) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium text-gray-700">
                Sig:
              </label>
              <textarea
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500"
                value={modalContext?.state?.selectedMedicine?.sig}
                onChange={(e) =>
                  modalContext?.onAddMedicine({ data: e, field: 'sig' })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => modalContext?.onClick({ type: 'backToList' })}
                className="p-2 bg-[#00C643] text-white rounded hover:bg-green-400"
              >
                &larr; Back
              </button>
              <button
                onClick={() =>
                  modalContext?.onSubmitData({
                    link: 'add-medicine',
                    qty: modalContext?.state?.selectedMedicine?.qty,
                    medication: modalContext?.state?.selectedMedicine
                  })
                }
                className="px-4 py-2 bg-[#00C643] text-white rounded hover:bg-green-400"
              >
                {console.log(modalContext?.state?.selectedMedicine)}
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-col w-full h-58 border border-l-gray-500 gap-2">
        <div className="overflow-y-auto scroll-custom h-full mx-2">
          {modalContext?.state?.medication?.map((data, index) => (
            <div
              key={data.id}
              className="relative p-2 bg-gray-200 hover:bg-gray-200 cursor-pointer text-sm text-gray-500 mb-1 rounded-lg"
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: `${data?.medicine?.generic_name} (${data?.dosage}) &bull; ${data?.form} &bull; ${data?.frequency}`
                }}
              />
              <button
                type="button"
                onClick={() => handleOnDelete(data.id)}
                className="absolute top-1 right-0 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center "
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
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Medication);
