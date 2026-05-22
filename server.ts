import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import authRoutes from "./server/routes/auth";
import operationRoutes from "./server/routes/operations";
import aiRoutes from "./server/routes/chatbot";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      city: "Ungheni",
      country: "Republica Moldova",
      system: "AutoBOX-Un Autoservice ERP",
      timestamp: new Date().toISOString()
    });
  });

  // Mount Authentication & Authorization Routes
  app.use("/api/auth", authRoutes);

  // Mount Operation Routes
  app.use("/api", operationRoutes);

  // Mount AI Chatbot Routes
  app.use("/api/ai", aiRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting development server with Vite middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static files from production dist path...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting the server:", err);
});
