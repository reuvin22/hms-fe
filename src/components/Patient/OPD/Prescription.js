import React, { useEffect, useState } from 'react';
import { patientApi, useGetMedicineListQuery } from '@/service/patientService';
import { useCreateBulkMutation } from '@/service/settingService';

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

function Prescription({
  patientId,
  physicianId,
  medication,
  onRefetch,
  medicine,
  medicineForm,
  medicineFrequency
}) {
  const [isShowMedForm, setIsShowMedForm] = useState(false);
  const [searchMedicine, setSearchMedicine] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const [
    createBulk,
    { isLoading: createBulkLoading, isSuccess: createUserSuccess }
  ] = useCreateBulkMutation();

  // const { data: medicineList } = useGetMedicineListQuery({
  //     keywords: searchMedicine,
  // }, {
  //     enabled: !!searchMedicine
  // })

  useEffect(() => {
    let timer;
    if (alertMessage) {
      timer = setTimeout(() => {
        setAlertMessage('');
      }, 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [alertMessage]);

  // console.log(medicineList)
  const handleAddMedicine = (e, fieldName) => {
    setSelectedMedicine((prevData) => ({
      ...prevData,
      [fieldName]: e.target.value
    }));
  };

  const handleOnChange = (e, type, fieldName) => {
    switch (type) {
      case 'searchMedicine':
        setSearchMedicine(e.target.value);
        break;

      case 'addMedicine':
        console.log(fieldName);
        setSelectedMedicine((prevData) => ({
          ...prevData,
          [fieldName]: e.target.value
        }));
        break;

      default:
        break;
    }
  };

  // console.log(selectedMedicine)

  const handleOnClick = (data, type) => {
    console.log(data);
    switch (type) {
      case 'selectMedicine':
        setSelectedMedicine(data);
        setIsShowMedForm(true);
        break;

      case 'submitMedicine':
        if (data.qty > selectedMedicine?.quantity) {
          setAlertMessage(
            `Please refer to available stock (${selectedMedicine?.quantity})`
          );
        } else {
          // do the insert
          createBulk({
            data: { data, patientId, physicianId },
            actionType: 'createPrescription'
          })
            .unwrap()
            .then((response) => {
              if (response.status === 'success') {
                // setBtnSpinner(true)
                onRefetch();
              }
            })
            .catch((error) => {
              console.log(error);
            });
          setIsShowMedForm(false);
        }
        break;

      case 'backBtn':
        setSelectedMedicine(null);
        setIsShowMedForm(false);
        setAlertMessage('');
        break;

      default:
        break;
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex-col w-1/2 border-r-gray-300 border-r-[1px]">
        <div className="overflow-y-auto scroll-custom ">
          {!isShowMedForm && (
            <div className="sticky top-0">
              <input
                type="search"
                value={searchMedicine}
                onChange={(e) => handleOnChange(e, 'searchMedicine', _)}
                placeholder="Search..."
                className="p-1 w-full border-b-gray-300 border-b-[1px] bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-400"
              />
              <div className="">
                {medicine?.map((data) => (
                  <div
                    key={data.id}
                    className={`p-2 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-800 ${data.quantity === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={
                      data.quantity === 0
                        ? undefined
                        : () => handleOnClick(data, 'selectMedicine')
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

          {isShowMedForm && (
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Brand name:
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                  value={selectedMedicine?.brand_name}
                  readOnly
                />
                <label className="block text-sm font-medium text-gray-700">
                  Generic name:
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                  value={selectedMedicine?.generic_name}
                  readOnly
                />

                <label className="block text-sm font-medium text-gray-700">
                  Dose:
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
                  value={selectedMedicine?.dosage}
                  readOnly
                />

                <label className="block text-sm font-medium text-gray-700">
                  Form:
                </label>
                <select
                  className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mr-4 focus:outline-none focus:border-gray-500 text-sm"
                  onChange={(e) => handleOnChange(e, 'addMedicine', 'form')}
                >
                  <option>Select options</option>
                  {medicineForm?.map((option, index) => (
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
                  className={`mt-1 block w-full p-2 border bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500 ${alertMessage !== '' ? 'border-red-600' : 'border-gray-300'}`}
                  value={selectedMedicine.qty}
                  onChange={(e) => handleOnChange(e, 'addMedicine', 'qty')}
                />
                {alertMessage && (
                  <p className="text-xs text-red-600">
                    <span class="font-medium">Error!</span> {alertMessage}
                  </p>
                )}

                <label className="block text-sm font-medium text-gray-700">
                  Frequency:
                </label>
                <select
                  className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 mr-4 focus:outline-none focus:border-gray-500 text-sm"
                  onChange={(e) =>
                    handleOnChange(e, 'addMedicine', 'frequency')
                  }
                >
                  <option>Select options</option>
                  {medicineFrequency?.map((option, index) => (
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
                  value={selectedMedicine.sig}
                  onChange={(e) => handleOnChange(e, 'addMedicine', 'sig')}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOnClick(_, 'backBtn')}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  &larr; Back
                </button>
                <button
                  onClick={() =>
                    handleOnClick(selectedMedicine, 'submitMedicine')
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

      <div className="flex-col w-full p-5">
        <div className="overflow-y-auto scroll-custom h-full">
          {medication?.map((data, index) => (
            <div>
              <div
                key={data.id}
                className="p-4 rounded bg-gray-200 cursor-pointer text-sm text-gray-500 hover:text-gray-800"
                // onClick={() => moveItemToLeft(item.id)}
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html: `${data?.medicine.generic_name} (${data.dose}) &bull; ${data.form} &bull; ${data.frequency}`
                  }}
                />
              </div>
              <br />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Prescription);
