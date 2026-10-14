const express = require("express");

const usersRoutes = require("./routes/users");
const healthRoutes = require("./routes/health");

const app = express();

app.use(express.json());

app.use("/users", usersRoutes);
app.use("/health", healthRoutes);

// Answer malformed JSON bodies with a JSON error instead of Express's HTML page.
// Anything else falls through to the default error handler.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON in request body" });
  }
  next(err);
});

const PORT =process.env.PORT || 3000;

// Only start the server when this file is run directly (e.g. `npm run dev`),
// so the tests can import `app` without opening a real port.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
