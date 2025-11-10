import React from 'react';
import Image from 'next/image';
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand p-10">
        <div>
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto"
          />

          <div className="space-y-5 text-white">
            <h1 className="h1">Manage your files the best way</h1>
            <p className="body-1">This is a place to tore All your files</p>
          </div>
        </div>
      </section>
      <section className="flex-1 p-10">{children}</section>
    </div>
  );
};

export default Layout;
