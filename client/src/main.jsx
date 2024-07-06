import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/auth.jsx";
import { SearchProvider } from "./context/Search.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SearchProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SearchProvider>
  </AuthProvider>
);
