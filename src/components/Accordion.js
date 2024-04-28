import { useState } from 'react';

function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-md overflow-hidden">
      <button
        className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      <div
        className={`transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Accordion;
