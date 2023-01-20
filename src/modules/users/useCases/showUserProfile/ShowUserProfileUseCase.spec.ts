let showUserProfileUseCase: ShowUserProfileUseCase
let userRepositoryInMemory: InMemoryUsersRepository

import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileError } from './ShowUserProfileError';

describe("Suite test Show User Profile", () => {
  beforeEach(() => {
    userRepositoryInMemory= new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
  })

  it("Should be able to show informations of the user authenticated", async () => {
    let name = "User 1";

    const userCreated = await userRepositoryInMemory.create({
      name,
      email: "user@test.com.br",
      password: "12345",
    });

    let user_id = userCreated.id as string;

    const user = await showUserProfileUseCase.execute(user_id)

    expect(user).toHaveProperty("id");
  })

  it("Should not be able to show un-existing user's profile", async () => {

    expect(async () =>{
      let user_id = '123';

      const user = await showUserProfileUseCase.execute(user_id)
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
