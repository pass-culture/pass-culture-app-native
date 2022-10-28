const dispatch = jest.fn()

const identification = {
  firstName: 'John',
  lastName: 'Doe',
  birthDate: '1993-01-28',
}

const profile = {
  name: null,
  city: null,
  address: null,
  status: null,
  hasSchoolTypes: false,
  schoolType: null,
}
export const useSubscriptionContext = jest
  .fn()
  .mockReturnValue({ dispatch, identification, profile })
