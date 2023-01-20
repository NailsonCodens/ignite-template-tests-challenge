import request from "supertest";
import { Connection } from "typeorm";


import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe("Suite Create Statement Controller tests", () => {
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

  it("Should be able to create a new statement deposit", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testuser@email.com",
      password: "testuser"
    });

    const {token} = responseToken.body

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 200,
      description: "Money"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body).toHaveProperty("type", "deposit")

  });

  it("Should be able to create a new statement withdraw", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testuser@email.com",
      password: "testuser"
    });

    const {token} = responseToken.body

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 60,
      description: "Withdraw money"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body).toHaveProperty("type", "withdraw")
  });

  it("Should not be able to create a new statement with a non-existing user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "nonuser@email.com",
      password: "nonpassword"
    });

    const {token} = responseToken.body

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 200,
      description: "Money"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(401)
  });

  it("Should not be able to make a withdraw with insuficient money", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testuser@email.com",
      password: "testuser"
    });

    const {token} = responseToken.body

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 210,
      description: "Withdraw money"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(400)
  });
})
