import React from "react";


export default function BaseLayout({
  children,
}) {
  return (
    <div className="container mt-20 mx-auto max-w-4xl min-h-screen">
      {children}
    </div>
  );
}