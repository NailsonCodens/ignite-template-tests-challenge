import request from "supertest";
import { Connection } from "typeorm";


import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe("Suite Show User Controller tests", () => {
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

  it("Should be able to show user's information", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testuser@email.com",
      password: "testuser"
    });

    const { token } = responseToken.body;


    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
  });

  it("Should not be able to show user's information with non-existing user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "nonuser@email.com",
      password: "nonuser"
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(401);
  });
})
