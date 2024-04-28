import Link from 'next/link';
import { Menu } from '@headlessui/react';

function DropdownLink({ children, ...props }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          {...props}
          className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
            active ? 'bg-gray-100' : ''
          } focus:outline-none transition duration-150 ease-in-out`}
        >
          {children}
        </Link>
      )}
    </Menu.Item>
  );
}

export function DropdownButton({ children, ...props }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
            active ? 'bg-gray-100' : ''
          } focus:outline-none transition duration-150 ease-in-out`}
          {...props}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
}

export function DropdownNotification({ children, ...props }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
            active ? 'bg-gray-100' : ''
          } focus:outline-none transition duration-150 ease-in-out`}
          {...props}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
}

export function DropdownExport({ children, ...props }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          className={`w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 ${
            active ? 'bg-gray-100' : ''
          } focus:outline-none transition duration-150 ease-in-out`}
          {...props}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
}

export const DropdownMenu = ({ children, ...props }) => {
  <Menu.Item>
    {({ active }) => (
      <button
        className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
          active ? 'bg-gray-100' : ''
        } focus:outline-none transition duration-150 ease-in-out`}
        {...props}
      >
        {children}
      </button>
    )}
  </Menu.Item>;
};

export const DropdownRowMenu = ({ children, ...props }) => {
  <Menu.Item>
    {({ active }) => (
      <button
        className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
          active ? 'bg-gray-100' : ''
        } focus:outline-none transition duration-150 ease-in-out z-50`}
        {...props}
      >
        {children}
      </button>
    )}
  </Menu.Item>;
};

export default DropdownLink;
