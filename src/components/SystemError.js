import React from 'react';
import { useRouter } from 'next/router';

function SystemError({ message }) {
  const router = useRouter();
  const handleClick = () => {
    router.push('/');
    // console.log(router.pathname)
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">401 Unauthorized</h1>
        <p className="mt-4 text-gray-600">
          Oops! You are not authorized to access this page.
        </p>
      </div>
    </div>
  );
}

export default SystemError;
