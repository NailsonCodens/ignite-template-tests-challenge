import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Suite test authentication", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to authenticate user", async () => {
    let email = "user@test.com.br";
    let password = "12345";

    const userCreated = await createUserUseCase.execute({
      name: "User One Auth",
      email,
      password
    });

    const userAuthenticated = await authenticateUserUseCase.execute({email, password});

    expect(userAuthenticated).toHaveProperty("token")
  })

  it("Should not be able to authenticate user with incorrect email", async () => {

    expect(async () => {

      let email = "user@test.com.br";
      let password = "12345";

      const userCreated = await createUserUseCase.execute({
        name: "User One Auth",
        email,
        password
      });

      await authenticateUserUseCase.execute({email: "user@nottest.com.br", password});
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })


  it("Should not be able to authenticate user with incorrect password", async () => {

    expect(async () => {

      let email = "user@test.com.br";
      let password = "12345";

      const userCreated = await createUserUseCase.execute({
        name: "User One Auth",
        email,
        password
      });

      await authenticateUserUseCase.execute({email, password: "123456"});
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
