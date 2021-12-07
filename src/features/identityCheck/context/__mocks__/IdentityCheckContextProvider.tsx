const dispatch = jest.fn()

const identification = {
  firstName: 'John',
  lastName: 'Doe',
  birthDate: '1993-01-28',
  countryCode: 'OK',
}
export const useIdentityCheckContext = jest.fn().mockReturnValue({ dispatch, identification })
