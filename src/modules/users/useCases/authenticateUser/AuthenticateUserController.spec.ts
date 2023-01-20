import request from "supertest";
import { Connection } from "typeorm";


import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe("Suite Authenticate User Controller tests", () => {
  beforeAll(async() => {
    connection = await createConnection();
    await connection.runMigrations();

    const userCreated = await request(app).post("/api/v1/users").send({
      name: "TestUser",
      email: "testuser@email.com",
      password: "testuser"
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "testuser@email.com",
      password: "testuser"
    });


    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("token")

  });

  it("Should not be able to authenticate a non-existing user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "nonuser@email.com",
      password: "testuser"
    });

    expect(response.status).toBe(401)

  });
})
