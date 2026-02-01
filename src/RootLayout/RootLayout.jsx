import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../component/Navbar';

const RootLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;