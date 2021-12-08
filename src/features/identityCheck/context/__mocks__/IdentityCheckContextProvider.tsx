const dispatch = jest.fn()

const identification = {
  firstName: 'John',
  lastName: 'Doe',
  birthDate: '1993-01-28',
}
export const useIdentityCheckContext = jest.fn().mockReturnValue({ dispatch, identification })
