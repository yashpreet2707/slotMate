import React, { Suspense } from "react";

const AvailabilityLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="mx-auto">
      <Suspense>{children}</Suspense>
    </div>
  );
};

export default AvailabilityLayout;
