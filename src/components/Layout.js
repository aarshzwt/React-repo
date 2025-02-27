import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <main className="flex-grow relative">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;