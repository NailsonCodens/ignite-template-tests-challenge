import request from "supertest";
import { Connection } from "typeorm";


import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe("Suite Get Statment Operation Controller tests", () => {
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

  it("Should be able to show the statement operation", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testuser@email.com",
      password: "testuser"
    });

    const {token} = responseToken.body

    const responseDeposit = await request(app).post("/api/v1/statements/deposit").send({
      amount: 200,
      description: "Money"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const {id} = responseDeposit.body;


    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200)
  });

  it("Should not be able to show the statement operation with a non-existing user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "nonuser@email.com",
      password: "nonpassword"
    });

    const {token} = responseToken.body

    const responseDeposit = await request(app).post("/api/v1/statements/deposit").send({
      amount: 200,
      description: "Money"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const {id} = responseDeposit.body;


    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(401)
  });

  it("Should not be able to show the statement operation with a non-existing statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "nonuser@email.com",
      password: "nonpassword"
    });

    const {token} = responseToken.body

    const responseDeposit = await request(app).post("/api/v1/statements/deposit").send({
      amount: 200,
      description: "Money"
    }).set({
      Authorization: `Bearer ${token}`,
    });

    const {id} = responseDeposit.body;

    const response = await request(app).get(`/api/v1/statements/1234455`).set({
      Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(401)
  });

})
