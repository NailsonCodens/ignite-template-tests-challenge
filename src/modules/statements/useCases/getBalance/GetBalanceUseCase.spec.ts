import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { OperationType } from '../../entities/Statement';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;

describe("Suite Get Balance Use Case", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUserRepository);
  })

  it("Should be able to show balance", async () => {
    const userCreated = await createUserUseCase.execute({
      name: "User one",
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

    const balance = await getBalanceUseCase.execute({user_id: userCreated.id});

    expect(balance.statement).toContain(deposit);
  })

  it("Should not be able to show balance if user not exists", async () => {
    expect(async () => {
      const userCreated = await createUserUseCase.execute({
        name: "User one",
        email: "user@test.com.br",
        password: "123"
      });

      const balance = await getBalanceUseCase.execute({user_id: "123324"});
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
