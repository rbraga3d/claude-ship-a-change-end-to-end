const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../server");

test("PUT /users/:id with malformed JSON returns a JSON 400", async () => {
  const res = await request(app)
    .put("/users/1")
    .set("Content-Type", "application/json")
    .send("{bad");

  assert.strictEqual(res.status, 400);
  assert.match(res.headers["content-type"], /application\/json/);
  assert.strictEqual(res.body.error, "Malformed JSON in request body");
});

test("POST /users with malformed JSON returns a JSON 400", async () => {
  const res = await request(app)
    .post("/users")
    .set("Content-Type", "application/json")
    .send('{"name": ');

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.error, "Malformed JSON in request body");
});
