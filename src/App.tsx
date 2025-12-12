import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Properties from "./pages/properties/Properties";
import RegisterPropeties from "./pages/registerpropeties/RegisterPropeties";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="registerpropeties" element={<RegisterPropeties />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
