import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./pages/App.tsx";
/* import "./pages/index.css" */

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);