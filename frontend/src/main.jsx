import React from "react";
import { createRoot } from "react-dom/client"; // Only import createRoot
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// Use createRoot instead of ReactDOM.createRoot
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
