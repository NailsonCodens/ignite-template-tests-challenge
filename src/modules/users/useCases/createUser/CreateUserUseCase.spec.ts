import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { CreateUserError } from './CreateUserError';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;


describe("Suite test Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to create a new user", async () => {
    let name = "User one";

    const userCreated = await createUserUseCase.execute({
      name,
      email: "user@test.com.br",
      password: "12345"
    });

    const compareEqual = await compare("12345", userCreated.password);

    expect(userCreated).toHaveProperty("id")
    expect(compareEqual).toBe(true)
  })

  it("Should not be able to create a new user if already exists", async () => {

    expect(async () => {
      let name = "User one";

      await createUserUseCase.execute({
        name,
        email: "user@test.com.br",
        password: "12345"
      });

      await createUserUseCase.execute({
        name,
        email: "user@test.com.br",
        password: "12345"
      });
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
