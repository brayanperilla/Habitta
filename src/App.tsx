import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/home/Home";
import Properties from "./pages/properties/Properties";
import RegisterPropeties from "./pages/registerpropeties/RegisterPropeties";
import Promotion from "./pages/promotion_tmp/Promotion";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="registerpropeties" element={<RegisterPropeties />} />
          <Route path="promotion" element={<Promotion />} />
        </Route>
      </Routes></>
  );
}

export default App;