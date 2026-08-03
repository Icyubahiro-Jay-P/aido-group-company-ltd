import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// PWA service worker: precaches the app shell so the hosted frontend keeps
// loading and running with no internet after the first visit.
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);