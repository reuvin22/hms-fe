import { useState } from 'react';
import ProfilePicture from './ProfilePicture';

function ProfileInformation({ information }) {
  const [isContactOpen, setContactOpen] = useState(false);

  console.log(information);
  return (
    <div className="bg-gray-100 p-8 pt-[5rem]">
      <div className="flex gap-6">
        <div className="flex-none w-2/5 p-6 bg-white shadow-lg rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ProfilePicture
                width={100}
                height={100}
                font={40}
                userDetails={information}
              />
              {/* <img className="h-16 w-16 rounded-full object-cover border-2 border-blue-500" src="path_to_user_image.jpg" alt="User" /> */}
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  {information.personal_information?.first_name}{' '}
                  {information.personal_information?.last_name}
                </h3>
                {/* <p className="text-sm text-gray-500">Job Title</p> */}
              </div>
            </div>
            {/* <div>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled >Edit Profile</button>
                        </div> */}
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-700 mb-4 cursor-pointer">
              Profile Information
            </h4>
            <div className="flex items-center text-gray-600 mb-4">
              <svg
                className="h-6 w-6 mr-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                />
              </svg>
              {information.user_id}
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <svg
                className="h-6 w-6 mr-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.516-4.55A1 1 0 0110.22 1h3.56a1 1 0 01.948 1.266l-1.516 4.55a1 1 0 00.948 1.316H19a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {information.email}
            </div>
          </div>
        </div>
        {/* <div className="flex-none w-3/5 p-6 bg-white shadow-lg rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">Activity Logs</h4>
                    <ul className="text-gray-600 space-y-2">
                        <li><strong>10:30 AM:</strong> Logged in</li>
                        <li><strong>10:45 AM:</strong> Updated profile</li>
                        <li><strong>11:15 AM:</strong> Changed password</li>
                    </ul>
                
                </div> */}
      </div>
    </div>
  );
}

export default ProfileInformation;
