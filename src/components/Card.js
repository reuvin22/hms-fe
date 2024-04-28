function Card({ children, title }) {
  return (
    <div className="mb-4">
      <div className="font-bold text-xl mb-2 ml-4 uppercase text-gray-600">
        {title}
      </div>
      <div className="  sm:rounded-lg rounded-md  overflow-hidden shadow bg-white max-h-[40vh] overflow-y-auto scroll-py-px">
        <div className="px-2 py-3">
          {children}
          {/* <div className="font-bold text-xl mb-2">Card Title</div>
                        <p className="text-gray-700 text-base">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut rhoncus quis magna in tempus.
                        </p> */}
        </div>
      </div>
    </div>
  );
}

export default Card;
