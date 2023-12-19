const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const connectionString = process.env.CONNECTION_STRING;

beforeAll(async () => {
  await mongoose.connect(connectionString);
});

const searchString = "lol";

// TDD for check the search Route

it("GET /search/globalSearch", async () => {
  const res = await request(app).get(
    `/search/globalSearch?search=${searchString}`
  );

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});

afterAll(async () => {
  await mongoose.disconnect();
});
