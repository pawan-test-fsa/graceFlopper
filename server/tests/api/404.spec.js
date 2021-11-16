require("dotenv").config();
const request = require("supertest");
const app = require("../../app");

describe("/api/unknown", () => {
  it("should return a 404", async () => {
    const response = await request(app).get("/api/unknown");
    expect(response.status).toEqual(404);
    expect(typeof response.body.message).toEqual("string");
  });
});
