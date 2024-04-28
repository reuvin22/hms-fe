import { useComponentContext } from '@/utils/context';
import { useState } from 'react';

function Profile() {
  const componentContext = useComponentContext();
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const birthDate = componentContext?.state?.user_data_info?.birth_date;
  const formattedBirthDate = new Date(birthDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleImageChange = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-8 flex justify-between">
      <div>
        <div className="flex items-center">
          {/* <div className="relative rounded-full border overflow-hidden w-28 h-28">
                        <img 
                            src={imagePreviewUrl} 
                            alt="img" 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <label htmlFor="photo-upload" className="cursor-pointer">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0020.07 7H21a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </label>
                            <input type="file" id="photo-upload" className="hidden" onChange={handleImageChange}/>
                        </div>
                    </div>    */}

          <div className="px-4">
            <div className="flex flex-col">
              <span className="text-gray-600 font-medium text-[2.5rem]">
                {componentContext?.state?.user_data_info?.first_name
                  ?.charAt(0)
                  .toUpperCase() +
                  componentContext?.state?.user_data_info?.first_name?.slice(
                    1
                  )}{' '}
                {componentContext?.state?.user_data_info?.last_name
                  ?.charAt(0)
                  .toUpperCase() +
                  componentContext?.state?.user_data_info?.last_name?.slice(1)}
              </span>
              <span className="text-gray-600 font-medium text-sm text-right">
                {componentContext?.state?.user_data_info?.email}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-end pt-4 divide-x divide-gray-300 pb-3">
            <div className="flex items-center px-3">
              <svg
                dataSlot="icon"
                fill="currentColor"
                className="w-5 h-5 text-gray-600"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M1 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V6Zm4 1.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2 3a4 4 0 0 0-3.665 2.395.75.75 0 0 0 .416 1A8.98 8.98 0 0 0 7 14.5a8.98 8.98 0 0 0 3.249-.604.75.75 0 0 0 .416-1.001A4.001 4.001 0 0 0 7 10.5Zm5-3.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm0 6.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm.75-4a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"
                />
              </svg>
              <span className="text-gray-600 font-medium text-sm ml-1">
                {componentContext?.state?.patient_id}
              </span>
            </div>
            <div className="flex items-center px-3">
              <svg
                dataSlot="icon"
                fill="currentColor"
                className="w-5 h-5 text-gray-600"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="m6.75.98-.884.883a1.25 1.25 0 1 0 1.768 0L6.75.98ZM13.25.98l-.884.883a1.25 1.25 0 1 0 1.768 0L13.25.98ZM10 .98l.884.883a1.25 1.25 0 1 1-1.768 0L10 .98ZM7.5 5.75a.75.75 0 0 0-1.5 0v.464c-1.179.304-2 1.39-2 2.622v.094c.1-.02.202-.038.306-.052A42.867 42.867 0 0 1 10 8.5c1.93 0 3.83.129 5.694.378.104.014.206.032.306.052v-.094c0-1.232-.821-2.317-2-2.622V5.75a.75.75 0 0 0-1.5 0v.318a45.645 45.645 0 0 0-1.75-.062V5.75a.75.75 0 0 0-1.5 0v.256c-.586.01-1.17.03-1.75.062V5.75ZM4.505 10.365A41.36 41.36 0 0 1 10 10c1.863 0 3.697.124 5.495.365C16.967 10.562 18 11.838 18 13.28v.693a3.72 3.72 0 0 1-1.665-.393 5.222 5.222 0 0 0-4.67 0 3.722 3.722 0 0 1-3.33 0 5.222 5.222 0 0 0-4.67 0A3.72 3.72 0 0 1 2 13.972v-.693c0-1.441 1.033-2.717 2.505-2.914ZM15.665 14.92a5.22 5.22 0 0 0 2.335.552V16.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 16.5v-1.028c.8 0 1.6-.184 2.335-.551a3.722 3.722 0 0 1 3.33 0c1.47.735 3.2.735 4.67 0a3.722 3.722 0 0 1 3.33 0Z" />
              </svg>
              <span className="text-gray-600 font-medium text-sm ml-1">
                {formattedBirthDate}
              </span>
            </div>

            <div className="flex items-center px-3">
              <svg
                dataSlot="icon"
                fill="currentColor"
                className="w-5 h-5 text-gray-600"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
                />
              </svg>
              <span className="text-gray-600 font-medium text-sm ml-1">
                {componentContext?.state?.patient_hrn}
              </span>
            </div>
            <div className="flex items-center px-3">
              <span className="text-white font-medium text-xs flex justify-center items-center bg-green-700 p-1 rounded-md relative">{`${
                componentContext?.state?.type_visit === 'new_ipd' ||
                componentContext?.state?.type_visit === 'new_opd'
                  ? 'NEW'
                  : componentContext?.state?.type_visit === 'revisit_ipd' ||
                      componentContext?.state?.type_visit === 'revisit_opd'
                    ? 'REVISIT'
                    : componentContext?.state?.type_visit === 'former_opd'
                      ? 'FORMER OPD'
                      : ''
              }`}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => componentContext?.onClick()}
          className="bg-slate-500 hover:bg-slate-600 rounded-full p-2 flex items-center text-white"
        >
          <svg
            dataSlot="icon"
            fill="currentColor"
            className="h-5 w-5 "
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
            />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}

export default Profile;
