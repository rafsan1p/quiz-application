import React from 'react';
import { Outlet } from 'react-router-dom';  // dom add
import Navbar from '../component/Navbar';  // Your folder name

const RootLayout = () => {
  return (
    <div className="min-h-screen">  // Full height for scroll
      <Navbar />  // Self-closing
      <Outlet />  // Pages here
    </div>
  );
};

export default RootLayout;