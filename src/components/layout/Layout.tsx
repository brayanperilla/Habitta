import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ width: "100%", boxSizing: "border-box" }}>
        {/* Aquí se renderizan las rutas hijas */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
