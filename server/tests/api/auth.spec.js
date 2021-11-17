require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
const faker = require("faker");
const { createUser } = require("../../db/users");

const { objectContaining } = expect;

describe("POST /auth/register", () => {
  it("Registers a New User", async () => {
    const fakeUser = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    const response = await request(app).post("/auth/register").send(fakeUser);

    expect(response.body).toEqual(
      objectContaining({
        username: fakeUser.username,
        id: expect.any(Number),
      })
    );
  });
});

describe("POST /auth/login", () => {
  it("Logs in a User", async () => {
    const fakeUser = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    };
    await request(app).post("/auth/register").send(fakeUser);
    const response = await request(app).post("/auth/login").send(fakeUser);
    console.log(response.body);
    expect(response.status).toEqual(200);
  });
});
