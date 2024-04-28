import Link from 'next/link';

function NavLink({ active = false, children, ...props }) {
  return (
    <Link
      {...props}
      className={`text-lg ${
        active
          ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
          : ' border-transparent text-gray-500 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
      }`}
    >
      {children}
    </Link>
  );
}

export default NavLink;
