import React from 'react';

function SkeletonScreen({ loadingType }) {
  return loadingType === 'table' ? (
    <div className="grid px-7 gap-y-2 pr-[6rem] pl-[6rem] pt-[7rem]">
      <div className="flex justify-between">
        <div className="flex space-x-3">
          <div className="w-28 h-8 bg-gray-300 rounded animate-pulse" />
          <div className="w-28 h-8 bg-gray-300 rounded animate-pulse" />
        </div>

        <div>
          <div className="w-40 h-8 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex space-x-3">
        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse" />
        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse" />
        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse" />
        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse" />
      </div>
      <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
      <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
    </div>
  ) : loadingType === 'mainPatientModule' ? (
    <div className="grid px-7 gap-y-2 pt-[7rem]">
      <div className="flex space-x-3">
        <div className="w-full h-40 bg-gray-300 rounded animate-pulse" />
        <div className="w-full h-40 bg-gray-300 rounded animate-pulse" />
        <div className="w-full h-40 bg-gray-300 rounded animate-pulse" />
      </div>
      <div className="flex justify-between">
        <div className="flex space-x-3">
          <div className="w-28 h-8 bg-gray-300 rounded animate-pulse" />
          <div className="w-28 h-8 bg-gray-300 rounded animate-pulse" />
        </div>

        <div>
          <div className="w-40 h-8 bg-gray-300 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex space-x-3">
        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse" />
        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse" />
        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse" />
        <div className="w-1/2 h-8 bg-gray-300 rounded animate-pulse" />
      </div>
      <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
      <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
    </div>
  ) : (
    ''
  );
}

export default React.memo(SkeletonScreen);
