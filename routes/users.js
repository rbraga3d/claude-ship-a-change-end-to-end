const express = require("express");
const store = require("../db/store");

const router = express.Router();

// GET /users — list every user
router.get("/", (req, res) => {
  res.json(store.getAllUsers());
});

// GET /users/:id — fetch a single user, or 404 if it doesn't exist
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = store.getUserById(id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

// POST /users — create a user; name and email are required
router.post("/", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const user = store.createUser({ name, email });
  res.status(201).json(user);
});

const ALLOWED_FIELDS = ["name", "email"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns an error message for an invalid update body, or null if it is valid.
function validateUserInput(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Request body must be a JSON object with name and email";
  }

  const unknown = Object.keys(body).filter((key) => !ALLOWED_FIELDS.includes(key));
  if (unknown.length > 0) {
    return `Unknown field(s): ${unknown.join(", ")}`;
  }

  const missing = ALLOWED_FIELDS.filter((key) => body[key] === undefined);
  if (missing.length > 0) {
    return `Missing required field(s): ${missing.join(", ")}`;
  }

  const notStrings = ALLOWED_FIELDS.filter(
    (key) => typeof body[key] !== "string" || body[key].trim() === "",
  );
  if (notStrings.length > 0) {
    return `Field(s) must be non-empty strings: ${notStrings.join(", ")}`;
  }

  if (!EMAIL_PATTERN.test(body.email.trim())) {
    return "email must be a valid email address";
  }

  return null;
}

// PUT /users/:id — replace a user's name and email; 400 on bad input, 404 if missing
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const validationError = validateUserInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const user = store.updateUser(id, {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

module.exports = router;
