const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();
const UserLogin = require("./models/usersLogin");

const connectionString = process.env.CONNECTION_STRING;

const newUserGamer = {
  lastname: "Gamer",
  firstname: "La Capsule",
  email: "test@capsule.com",
  username: "test-lacapsule",
  password: "test123",
  token: "faketoken",
};

const newUserCoach = {
  lastname: "Coach",
  firstname: "La Capsule",
  email: "test@capsule.com",
  username: "test-lacapsule",
  password: "test123",
  token: "faketoken",
};

beforeAll(async () => {
  await mongoose.connect(connectionString);
});

it("Users schema & model", () => {
  expect(UserLogin).toBeDefined();

  const newFakeUser = new UserLogin(newUserGamer);

  expect(newFakeUser).toHaveProperty("_id");
  expect(newFakeUser).toHaveProperty("username", newUserGamer.username);
  expect(newFakeUser).toHaveProperty("password", newUserGamer.password);
  expect(newFakeUser).toHaveProperty("token", newUserGamer.token);
  expect(newFakeUser).toHaveProperty("isCoach", newUserGamer.isCoach);
});

it("POST /users/signup/gamer", async () => {
  const res = await request(app).post("/users/signup/gamer").send(newUserGamer);

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.token).toEqual(expect.any(String));
  expect(res.body.token.length).toBe(32);
});

it("POST /users/signin for gamer", async () => {
  const res = await request(app).post("/users/signup/gamer").send(newUserGamer);
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.token).toEqual(expect.any(String));
  expect(res.body.token.length).toBe(32);

  const res2 = await request(app).post("/users/signin").send({
    username: newUserGamer.username,
    password: newUserGamer.password,
  });
  expect(res2.statusCode).toBe(200);
  expect(res2.body.result).toBe(true);
  expect(res.body.token).toEqual(expect.any(String));
  expect(res.body.token.length).toBe(32);
});

it("POST /users/signup/coach", async () => {
  const res = await request(app).post("/users/signup/coach").send(newUserCoach);

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.token).toEqual(expect.any(String));
  expect(res.body.token.length).toBe(32);
});

it("POST /users/signin for coach", async () => {
  const res = await request(app).post("/users/signup/coach").send(newUserCoach);
  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.token).toEqual(expect.any(String));
  expect(res.body.token.length).toBe(32);

  const res2 = await request(app).post("/users/signin").send({
    username: newUser.username,
    password: newUser.password,
  });
  expect(res2.statusCode).toBe(200);
  expect(res2.body.result).toBe(true);
  expect(res.body.token).toEqual(expect.any(String));
  expect(res.body.token.length).toBe(32);
});

afterAll(async () => {
  await mongoose.disconnect();
});
