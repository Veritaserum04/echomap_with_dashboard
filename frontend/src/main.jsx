import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./auth/AuthContext";
import { EchoMapProvider } from "./context/EchoMapContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EchoMapProvider>
          <App />
        </EchoMapProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);