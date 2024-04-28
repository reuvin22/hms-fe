import { useEffect } from 'react';

function Button({
  bgColor,
  btnLoading,
  btnName,
  paddingY = 2,
  onClick,
  btnIcon,
  onBtnLoading,
  children
}) {
  let bgColorChange;
  let iconChange;

  switch (paddingY) {
    case '2':
      paddingY = 'py-2';
      break;

    default:
      paddingY = 'py-1';
      break;
  }

  switch (btnIcon) {
    case 'disable':
      iconChange = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 animate-spin"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="32"
            stroke-width="8"
            stroke="currentColor"
            strokeDasharray="50.26548245743669 50.26548245743669"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
      break;

    case 'close':
      iconChange = (
        <svg
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
      break;

    case 'submit':
      iconChange = (
        <svg
          fill="none"
          stroke="currentColor"
          className="h-6 w-6"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      );
      break;

    case 'add':
      iconChange = (
        <svg
          fill="none"
          stroke="currentColor"
          className="h-6 w-6"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
      break;

    case 'user':
      iconChange = (
        <svg
          fill="none"
          className="h-4 w-4"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
          />
        </svg>
      );
      break;

    default:
      iconChange = (
        <svg
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      );
      break;
  }

  switch (bgColor) {
    case 'disable':
      bgColorChange = 'bg-gray-300';
      break;

    case 'neutral':
      bgColorChange = 'bg-neutral-500 hover:bg-neutral-600';
      break;

    case 'indigo':
      bgColorChange = 'bg-indigo-500 hover:bg-indigo-600';
      break;

    case 'emerald':
      bgColorChange = 'bg-emerald-500 hover:bg-emerald-600';
      break;

    case 'blue':
      bgColorChange = 'bg-blue-500 hover:bg-blue-600';
      break;

    default:
      bgColorChange = 'bg-slate-500 hover:bg-slate-600';
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center text-white px-2 text-sm ${paddingY} gap-2 rounded ${bgColorChange} focus:outline-none`}
      disabled={btnLoading}
    >
      {iconChange}
      {children}
    </button>
  );
}

export default Button;
