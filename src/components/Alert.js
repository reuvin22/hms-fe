import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const alertDetails = {
  success: {
    color: 'bg-green-500',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        className="h-6 w-6"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    )
  },
  error: {
    color: 'bg-red-500',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        className="h-6 w-6"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    )
  },
  warning: {
    color: 'bg-yellow-500',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        className="h-6 w-6"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
        />
      </svg>
    )
  }
};

function Alert({ isOpen: propIsOpen, message, alertType, onClose, display }) {
  const [isRendered, setIsRendered] = useState(propIsOpen);
  const { color, icon } = alertDetails[alertType] || {};
  const closeDuration = 3000;

  useEffect(() => {
    if (propIsOpen) {
      setIsRendered(true);
      const autoClose = setTimeout(() => {
        close();
      }, closeDuration);
      return () => clearTimeout(autoClose);
    }
  }, [propIsOpen]);

  const close = () => {
    onClose(false);
  };

  const handleTransition = () => {
    if (!propIsOpen) {
      setIsRendered(false);
    }
  };

  if (!isRendered) {
    return null;
  }

  // console.log(propIsOpen)

  return (
    <Transition
      show={propIsOpen}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      onExited={handleTransition}
    >
      <div
        className={`relative flex items-center p-3 mb-4 text-white z-50 w-56 top-[3.5rem] ${color} float-right ${display}`}
        role="alert"
      >
        <svg
          className="flex-shrink-0 w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">Info</span>
        <div className="ms-3 text-sm font-medium">
          <span dangerouslySetInnerHTML={{ __html: message }} />
        </div>
        {propIsOpen && (
          <button
            type="button"
            onClick={close}
            className="ms-auto -mx-1.5 -my-1.5 bg-red-300  rounded-lg  p-1.5 hover:bg-red-400 inline-flex items-center justify-center h-8 w-8 "
            ariaLabel="Close"
          >
            <span className="sr-only">Close</span>
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
        )}
      </div>
    </Transition>
  );
}

export default Alert;
