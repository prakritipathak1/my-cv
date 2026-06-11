import { RouterProvider } from "@tanstack/react-router";
import { createRoot } from "react-dom/client";
import { getRouter } from "./router";

console.log("main.tsx: Initializing app...");

try {
  // Get the router (which creates its own QueryClient internally)
  const router = getRouter();
  console.log("main.tsx: Router created successfully");

  // Get root element
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Could not find root element");
  }

  // Create and render app
  const root = createRoot(rootElement);
  console.log("main.tsx: Rendering RouterProvider...");
  root.render(<RouterProvider router={router} />);
  console.log("main.tsx: Render complete");
} catch (error) {
  console.error("main.tsx: Error occurred:", error);
  throw error;
}








