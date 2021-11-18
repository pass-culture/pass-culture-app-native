import { beneficiaryUser } from 'fixtures/user'

export const useUserProfileInfo = jest.fn().mockReturnValue({
  data: beneficiaryUser,
})
