import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(

    <UserProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
          </AuthProvider>
      </BrowserRouter>
    </UserProvider>
 
);
