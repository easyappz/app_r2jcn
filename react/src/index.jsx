import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const routes = ["/", "/register", "/login", "/profile", "/404"];
if (typeof window !== "undefined" && typeof window.handleRoutes === "function") {
  try { window.handleRoutes(routes); } catch (e) { /* noop */ }
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
