import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/manrope";
import Site from "./site";
import "./globals.css";

const root = document.getElementById("root");
if (!root) throw new Error("Application root is missing");

if (root.hasChildNodes()) {
  hydrateRoot(root, <Site />);
} else {
  createRoot(root).render(<Site />);
}
