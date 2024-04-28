import Link from 'next/link';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useContext } from 'react';
import socketIOClient from 'socket.io-client';

import { useDispatch, useSelector } from 'react-redux';
// import { logout, setModules } from '@/store/reducers/authSlice'
// import { userGrants } from '@/store/actions/authActions'
import {
  useLogoutMutation,
  useGetUserModulesQuery,
  useGetUserDetailsQuery
} from '@/service/authService';
import { useGetNotificationQuery } from '@/service/settingService';
import withAuth from '@/pages/withAuth';

// components
import Module from '@/components/Module';
import Dropdown from '@/components/Dropdown';
import SystemError from '@/components/SystemError';
import {
  DropdownButton,
  DropdownNotification
} from '@/components/DropdownLink';
import ApplicationLogo from '@/components/ApplicationLogo';
import ResponsiveNavLink, {
  ResponsiveNavButton
} from '@/components/ResponsiveNavLink';
import { debounce } from 'lodash';

import { AppLayoutContext } from '@/components/Layouts/AppLayout';
import {
  ComponentContext,
  TableContext,
  useComponentContext,
  useTableContext
} from '@/utils/context';
import ProfilePicture from '../ProfilePicture';
import SkeletonSidebarScreen from '../SkeletonSidbarScreen';
import NavLink from '../Navlink';

// const NEXT_IO = "http://localhost:6001"

function Navigation() {
  // props: user, children, moduleId, menuGroup
  const context = useContext(AppLayoutContext);
  const componentContext = useComponentContext();
  const tblContext = useTableContext();
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authToken = Cookies.get('token');
  const [refetchAttempts, setRefetchAttempts] = useState(0);
  const [overflow, setOverflow] = useState('hidden');
  const [notificationData, setNotificationData] = useState({});
  const [notificationCount, setNotificationCount] = useState(0);

  const [logout, { isLoading, isError, error, isSuccess }] =
    useLogoutMutation();
  const {
    data: module,
    isLoading: moduleIsLoading,
    isFetching: moduleIsFetching,
    isError: moduleIsError,
    refetch: moduleRefetch
  } = useGetUserModulesQuery({
    moduleId: context?.props.moduleId
  });

  const { data: prevNotification } = useGetNotificationQuery();
  const [notifications, setNotifications] = useState([]);

  // useEffect(() => {
  //     // if(moduleIsFetching) {
  //     //     moduleRefetch()
  //     // }

  //     if(notifications) {
  //         setNotificationCount(notifications?.length)
  //     }

  //     if(prevNotification) {
  //         setNotifications(prevNotification)
  //     }

  //     const echo = new Echo({
  //         broadcaster: 'pusher',
  //         key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  //         cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  //         wsHost: process.env.NEXT_PUBLIC_WS_HOST,
  //         wsPort: parseInt(process.env.NEXT_PUBLIC_WS_PORT, 10),
  //         wssPort: parseInt(process.env.NEXT_PUBLIC_WSS_PORT, 10),
  //         disabledStats: true,
  //         encrypted: true,
  //         enabledTransports: ['ws', 'wss'],
  //     })

  //     const debounceNotification = debounce((newData) => {
  //         setNotifications(prev => {
  //             const newNotif = newData.notificationData?.data
  //             // console.log('Adding notification:', newNotif)
  //             if(Array.isArray(prev)) {
  //                 const updateNotification = [...prev, newNotif]
  //                 updateNotification.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))

  //                 // console.log(updateNotification)
  //                 return updateNotification

  //             }
  //             return prev
  //         })
  //         // setNotifications(prev => [...prev, newData.notificationData?.data])
  //     })

  //       echo
  //         .channel('notifications')
  //         .subscribed(() => {console.log('You are subscribed')})
  //         .listen('NewNotification', (newData) => {
  //             // debounceNotification(newData)
  //             setNotifications(prev => [...prev, newData.notificationData?.data])
  //         })

  //     return () => {
  //         echo.leaveChannel('notifications')
  //     }

  // }, [notifications, prevNotification])

  const {
    data: userData,
    isError: dataError,
    refetch: refetchUserDetails
  } = useGetUserDetailsQuery();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // console.log(userData)

  const elapsedTime = (timestamp) => {
    const seconds = Math.floor(
      (Date.now() - new Date(timestamp).getTime()) / 1000
    );

    if (seconds < 60) return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  };

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem('isLoggedIn');
      Cookies.remove('token');
      router.replace('/');
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickedNotif = () => {};

  const handleOnClick = () => {
    componentContext?.onClose();
    // console.log("it worked")
  };

  const imgSrc = 'https://i.imgur.com/bqRsTjB.png';

  return (
    <>
      <aside
        className={`bg-[#343a40] z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ease-out duration-300 fixed inset-y-0 left-0 w-64`}
      >
        {sidebarOpen && (
          <div className="h-full px-3 py-20 pb-4 overflow-y-auto bg-[#343a40]">
            <img
              className="ml-5 mb-4 z-50"
              src="https://i.imgur.com/yB2p2AW.png"
              width={85}
              height={0}
            />
            {context?.props.isLoading ? (
              <SkeletonSidebarScreen />
            ) : (
              <ComponentContext.Provider
                value={{
                  data: {
                    menuGroup: context?.props.menuGroup
                  },
                  onClick: () => handleOnClick()
                }}
              >
                <Module module={module} />
              </ComponentContext.Provider>
            )}
          </div>
        )}
      </aside>

      <nav className="fixed top-0 z-50  border-b  bg-[#15803c] border-gray-700 w-full">
        <img
          className="ml-7 top-5 absolute z-50 hidden lg:block"
          src="https://i.imgur.com/yB2p2AW.png"
          width={85}
          height={0}
        />
        <aside
          className={`transform max-w-xs ease-in-out duration-300 fixed top-0 left-0 z-40 w-64 h-screen pt-[3.5rem] transition-transform  border-r  bg-[#343a40] border-gray-700 hidden lg:block`}
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-[#343a40]">
            {context?.props.isLoading ? (
              <SkeletonSidebarScreen />
            ) : (
              <ComponentContext.Provider
                value={{
                  data: {
                    menuGroup: context?.props.menuGroup
                  },
                  onClick: () => handleOnClick()
                }}
              >
                <Module module={module} />
              </ComponentContext.Provider>
            )}
          </div>
        </aside>

        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end ">
              <div className="flex items-center w-full lg:space-x-[17rem] pl-4">
                <h1
                  className={`text-white text-large font-small ${sidebarOpen ? 'block' : 'hidden'}`}
                ></h1>
                <button
                  className="text-white focus:outline-none me-2 block lg:hidden"
                  onClick={toggleSidebar}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 4h12a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                    ></path>
                  </svg>
                </button>
                <Link href="/">
                  <ApplicationLogo
                    image={imgSrc}
                    className="block h-10 w-auto fill-current text-white"
                  />
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center ml-6 max-h-60">
                <Dropdown
                  align="right"
                  width="80"
                  trigger={
                    <div className="mr-5">
                      <svg
                        onClick={() => setNotificationCount(0)}
                        dataSlot="icon"
                        fill="currentColor"
                        className="h-7 w-7 text-white cursor-pointer"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          clipRule="evenodd"
                          fillRule="evenodd"
                          d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                        />
                      </svg>

                      {notificationCount > 0 && (
                        <div className="absolute top-0 right-25 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                          {notificationCount}
                        </div>
                      )}
                    </div>
                  }
                >
                  <div className="font-bold text-sm uppercase text-gray-600 ml-2 p-2">
                    Notifications
                  </div>
                  <div className="divide-y divide-gray-200 overflow-x-hidden scroll-custom max-h-[30vh]">
                    {/* {notifications?.map((notification, index) => (
                                            <DropdownNotification key={index} onClick={handleClickedNotif}>
                                                <div className="flex items-start">
                                                    <img
                                                        src={notification?.iconUrl}
                                                        alt="User"
                                                        className="w-12 h-12 rounded-full mr-4 flex-shrink-0"
                                                    />
                                                    <div className="flex-grow ">
                                                        <span className="font-large">{notification?.title}</span>
                                                        <p className="text-xs text-gray-600 italic">{notification?.message}</p>
                                                        <div className="text-xs text-gray-500 w-full">
                                                            {elapsedTime(notification?.timestamp)}
                                                        </div>
                                                    </div>
                                                    {!notification?.isRead && 
                                                        <div className="ml-2 w-4 h-4 bg-blue-500 rounded-full"></div>
                                                    }
                                                </div>
                                            </DropdownNotification>
                                        ))} */}
                  </div>
                </Dropdown>

                <Dropdown
                  align="right"
                  width="48"
                  trigger={
                    <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                      <div>
                        <ProfilePicture
                          width={30}
                          height={30}
                          font={16}
                          userDetails={userData}
                        />
                      </div>
                      <div className="ml-1">
                        <svg
                          className="fill-current h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </button>
                  }
                >
                  {/* Authentication */}
                  <div className="divide-y divide-gray-100">
                    <div className="px-4 py-3" role="none">
                      <p className="text-sm text-gray-500" role="none">
                        {userData?.personal_information?.first_name}{' '}
                        {userData?.personal_information?.last_name}
                      </p>
                      <p
                        className="text-sm font-medium text-gray-500 truncate"
                        role="none"
                      >
                        {userData?.email}
                      </p>
                    </div>
                    <DropdownButton onClick={handleLogout}>
                      Logout
                    </DropdownButton>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="ml-0 lg:ml-64 top-0 bg-gray-100">
        <main>{context?.props.children}</main>
      </div>
    </>
  );
}

export default withAuth(Navigation);
