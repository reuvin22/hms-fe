import React from 'react';

function SkeletonSidebarScreen() {
  return (
    <>
      <div className="flex items-center mx-2 my-2 py-2 mt-4">
        <div className="bg-[#5e6064] w-8 h-8 rounded-full animate-pulse" />
        <div className="w-40 h-5 bg-[#5e6064] rounded-lg animate-pulse mx-2" />
      </div>
      <div className="flex items-center mx-2 my-2 py-2">
        <div className="bg-[#5e6064] w-8 h-8 rounded-full animate-pulse" />
        <div className="w-32 h-5 bg-[#5e6064] rounded-lg animate-pulse mx-2" />
      </div>
      <div className="flex items-center mx-2 my-2 py-2">
        <div className="bg-[#5e6064] w-8 h-8 rounded-full animate-pulse" />
        <div className="w-40 h-5 bg-[#5e6064] rounded-lg animate-pulse mx-2" />
      </div>
      <div className="flex items-center mx-2 my-2 py-2">
        <div className="bg-[#5e6064] w-8 h-8 rounded-full animate-pulse" />
        <div className="w-32 h-5 bg-[#5e6064] rounded-lg animate-pulse mx-2" />
      </div>
      <div className="flex items-center mx-2 my-2 py-2">
        <div className="bg-[#5e6064] w-8 h-8 rounded-full animate-pulse" />
        <div className="w-40 h-5 bg-[#5e6064] rounded-lg animate-pulse mx-2" />
      </div>
    </>
  );
}

export default React.memo(SkeletonSidebarScreen);
