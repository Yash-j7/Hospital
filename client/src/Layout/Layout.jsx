import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

function Layout({ children }) {
  return (
    <div>
      <Header />
      <main className="min-h-[70vh]">
        <Toaster />
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
