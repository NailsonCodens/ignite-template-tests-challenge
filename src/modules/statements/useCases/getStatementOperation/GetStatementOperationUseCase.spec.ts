import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { OperationType } from '../../entities/Statement';
import { GetStatementOperationError } from "./GetStatementOperationError";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;

describe("Suite Get Statement Operation tests", () => {
  beforeEach(async  () => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUserRepository, inMemoryStatementRepository)

  });

  it("Should be able to show statement", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "user one",
      email: "user@test.com.br",
      password: "123"
    });

    const statementCreated = await createStatementUseCase.execute({
      user_id: userCreated.id,
      type: "deposit" as OperationType,
      amount: 120,
      description: "money"
    })

    const statement = await getStatementOperationUseCase.execute({user_id: userCreated.id, statement_id: statementCreated.id})

    expect(statement).toHaveProperty("id")
    expect(statement.user_id).toEqual(userCreated.id)
  })

  it("Should not be able to show statement if user not exist", async () => {
    expect(async () => {
      const user_id = "Non-existing-user-732123789"
      const statement_id = "Non-existing-statement-732123789"
      await getStatementOperationUseCase.execute({
        user_id,
        statement_id
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it("Should not be able to show statement if user not exist", async () => {
    expect(async () => {

      const userCreated = await createUserUseCase.execute({
        name: "User one",
        email: "user@test.com.br",
        password: "123"
      });

      const user_id = userCreated.id
      const statement_id = "Non-existing-statement-732123789"
      await getStatementOperationUseCase.execute({
        user_id,
        statement_id
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
