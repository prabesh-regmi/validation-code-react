import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/homepage/homePage";
import SuccessPage from "../pages/SuccessPage";

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success-page" element={<SuccessPage />} />
        {/* <ProtectedRoute path="/users/*" component={<Users />} /> */}

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default Routing;
