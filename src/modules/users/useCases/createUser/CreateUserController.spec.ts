import request from "supertest";
import { Connection } from "typeorm";


import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe("Suite Create User Controller tests", () => {
  beforeAll(async() => {
    connection = await createConnection();
    await connection.runMigrations();

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create  a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "TestUser",
      email: "testuser@email.com",
      password: "testuser"
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create  a new user with the same email", async () => {
    await request(app).post("/api/v1/users").send({
      name: "TestUser3",
      email: "testuser@email.com",
      password: "testuser"
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "TestUser1",
      email: "testuser@email.com",
      password: "testuser"
    });

    expect(response.status).toBe(400);
  });
})
