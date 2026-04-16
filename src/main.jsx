import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

import("./App.jsx")
  .then(({ default: App }) => {
    root.render(<App />);
  })
  .catch((error) => {
    console.error("App failed to load", error);
    root.render(
      <div className="error-screen">
        <strong>Prototype failed to load</strong>
        <p>{error.message}</p>
        <span>The app shell is running, but the main module failed during import.</span>
      </div>
    );
  });
