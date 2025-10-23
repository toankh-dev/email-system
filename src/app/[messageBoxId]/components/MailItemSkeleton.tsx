import React from 'react';

/**
 * Skeleton component for mail items when they are loading
 */
export default function MailItemSkeleton() {
  return (
    <div className="mb-0.5 flex animate-pulse items-center bg-white py-2 pl-4 text-[12px] shadow-sm">
      {/* Checkbox skeleton */}
      <div className="pr-3">
        <div className="h-4 w-4 rounded bg-gray-200"></div>
      </div>

      {/* Avatar skeleton */}
      <div className="pt-1 pr-3">
        <div className="h-11 w-11 rounded-full bg-gray-200"></div>
      </div>

      {/* Content skeleton */}
      <div className="flex flex-1 items-center gap-4">
        {/* Name + Code skeleton */}
        <div className="min-w-[150px] pt-1">
          <div className="h-4 w-32 rounded bg-gray-200"></div>
          <div className="mt-1.5 h-3 w-20 rounded bg-gray-200"></div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1">
          <div className="flex">
            <div className="mr-1 h-4 w-16 rounded bg-gray-200"></div>
            <div className="h-4 w-48 rounded bg-gray-200"></div>
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            <div className="h-3 w-24 rounded bg-gray-200"></div>
          </div>
        </div>

        {/* Time skeleton */}
        <div className="flex flex-col items-end pt-1.5 pr-4 pl-4">
          <div className="h-3 w-16 rounded bg-gray-200"></div>
          <div className="mt-1 h-5 w-12 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
