
const request = require("supertest");
const app = require("./server");

describe("Task Management API", () => {
  test("GET /tasks returns status 200", async () => {
    const response = await request(app).get("/tasks");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET / returns API running message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      "Task Management API is running"
    );
  });

  test("POST /tasks creates a task", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "New task" });

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("New task");
  });

  test("POST /tasks rejects an empty title", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "" });

    expect(response.statusCode).toBe(400);
  });
});
