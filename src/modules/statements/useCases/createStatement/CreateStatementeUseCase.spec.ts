let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;

import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { OperationType } from '../../entities/Statement';
import { CreateStatementError } from './CreateStatementError';

describe("Suite Create User Use Case test", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementsRepository);
  })

  it("Should be able to create a new statement", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "user one",
      email: "user@test.com.br",
      password: "123"
    });

    const deposit = await createStatementUseCase.execute({
      user_id: userCreated.id,
      type: "deposit" as OperationType,
      amount: 120,
      description: "money"
    })

    const withdraw = await createStatementUseCase.execute({
      user_id: userCreated.id,
      type: "withdraw" as OperationType,
      amount: 120,
      description: "money"
    })

    expect(withdraw).toHaveProperty("id");
  })

  it("Should not be able to create a new statement with user not exists", async () => {
    expect(async () => {
      const deposit = await createStatementUseCase.execute({
        user_id: '123213123',
        type: "deposit" as OperationType,
        amount: 120,
        description: "money"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("Should not be able to make a withdrawal if you have no balance", async () => {
    expect(async() => {
      const userCreated = await createUserUseCase.execute({
        name: "user one",
        email: "user@test.com.br",
        password: "123"
      });

      const deposit = await createStatementUseCase.execute({
        user_id: userCreated.id,
        type: "deposit" as OperationType,
        amount: 120,
        description: "money"
      })

      const withdraw = await createStatementUseCase.execute({
        user_id: userCreated.id,
        type: "withdraw" as OperationType,
        amount: 200,
        description: "money"
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
