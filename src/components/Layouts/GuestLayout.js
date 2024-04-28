import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'node_modules/next/link';
import { useRouter } from 'next/router';
import { DropdownMenu } from '@/components/DropdownLink';
import Cookies from 'js-cookie';
import ApplicationLogo from '../ApplicationLogo';
import Dropdown from '../Dropdown';

function GuestLayout({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const imgSrc = 'https://i.imgur.com/bqRsTjB.png';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [contentHeight, setContentHeight] = useState(0);

  const handleLogout = () => {};

  useEffect(() => {
    const calculateHeight = () => {
      const windowHeight = window.innerHeight;
      setContentHeight(windowHeight);
    };
    calculateHeight();

    // Recalculate height on window resize
    window.addEventListener('resize', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Qhealth</title>
      </Head>

      <div
        className="bg-gray-100 relative overflow-x-hidden"
        style={{ height: `${contentHeight}px` }}
      >
        <header className="border border-b-gray-300 bg-white text-white sticky top-0 z-50">
          <div className="container mx-auto py-4 flex items-center justify-between ">
            <div>
              <Link href="/">
                <ApplicationLogo
                  image={imgSrc}
                  className="block h-10 w-auto fill-current text-white"
                />
              </Link>
            </div>

            <div className="flex space-x-4">
              <div className="sm:hidden md:hidden xl:block phone:hidden">
                <nav className="flex items-center ">
                  <a
                    href="/"
                    className="text-xs font-medium rounded-md text-black hover:text-gray-700 hover:bg-gray-200 px-4 py-2"
                  >
                    Home
                  </a>
                  <a
                    href="#"
                    className="text-xs font-medium rounded-md text-black hover:text-gray-700 hover:bg-gray-200 px-4 py-2"
                  >
                    About Us
                  </a>
                  <a
                    href="#"
                    className="text-xs font-medium rounded-md text-black hover:text-gray-700 hover:bg-gray-200 px-4 py-2"
                  >
                    News
                  </a>
                  <a
                    href="#"
                    className="text-xs font-medium rounded-md text-black hover:text-gray-700 hover:bg-gray-200 px-4 py-2"
                  >
                    Services
                  </a>
                  <a
                    href="#"
                    className="text-xs font-medium rounded-md text-black hover:text-gray-700 hover:bg-gray-200 px-4 py-2"
                  >
                    Doctors
                  </a>
                  <a
                    href="#"
                    className="text-xs font-medium rounded-md text-black hover:text-gray-700 hover:bg-gray-200 px-4 py-2"
                  >
                    Contact Us
                  </a>
                  {isLoggedIn ? (
                    <Link
                      href="/dashboard"
                      className="text-sm  bg-white text-black hover:text-blue-700 py-2 px-8 rounded-md font-medium transition duration-300"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className={`text-sm ${router.pathname === '/login' ? 'bg-gray-200' : ''} text-black hover:bg-gray-200 hover:text-gray-700 py-2 px-8 rounded-md font-medium transition duration-300`}
                    >
                      Login
                    </Link>
                  )}
                </nav>
              </div>

              <div className="sm:block md:block xl:hidden">
                <Dropdown
                  align="right"
                  width="48"
                  trigger={
                    <button
                      onClick={() => setOpen((open) => !open)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                    >
                      <svg
                        className="h-6 w-6"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        {open ? (
                          <path
                            className="inline-flex"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        ) : (
                          <path
                            className="inline-flex"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        )}
                      </svg>
                    </button>
                  }
                >
                  {/* Authentication */}
                  <DropdownMenu onClick={handleLogout}>Logout</DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto font-sans text-gray-900 antialiased">
          {children}
        </div>
      </div>
    </div>
  );
}

export default GuestLayout;
