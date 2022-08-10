import { createRoot } from "react-dom/client";
import App from "./App";

const rootContainer = document.getElementById("root");
const root = createRoot(rootContainer); // createRoot(container!) if you use TypeScript
root.render(<App />);
