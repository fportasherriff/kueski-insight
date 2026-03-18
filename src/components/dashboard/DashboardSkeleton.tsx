import React from 'react';

const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`bg-card rounded-2xl shadow-sm p-5 animate-pulse ${className}`}>
    <div className="w-9 h-9 rounded-full bg-muted mb-3" />
    <div className="h-8 w-24 bg-muted rounded mb-2" />
    <div className="h-4 w-32 bg-muted rounded mb-1" />
    <div className="h-3 w-40 bg-muted rounded" />
  </div>
);

const SkeletonChart = ({ className = '', height = 'h-[300px]' }: { className?: string; height?: string }) => (
  <div className={`bg-card rounded-2xl shadow-sm p-6 animate-pulse ${className}`}>
    <div className="h-5 w-40 bg-muted rounded mb-2" />
    <div className="h-3 w-56 bg-muted rounded mb-4" />
    <div className={`${height} bg-muted rounded`} />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-start">
      <div>
        <div className="h-8 w-40 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>
      <div className="h-10 w-32 bg-muted rounded animate-pulse" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
    </div>
    <SkeletonChart height="h-[350px]" />
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <SkeletonChart className="lg:col-span-3" height="h-[280px]" />
      <SkeletonChart className="lg:col-span-2" height="h-[280px]" />
    </div>
    <SkeletonChart height="h-[280px]" />
  </div>
);
