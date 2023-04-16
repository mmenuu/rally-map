import React from "react";


export default function BaseLayout({
  children,
}) {
  return (
    <div className="container mx-auto max-w-fit grid min-h-screen">
      {children}
    </div>
  );
}