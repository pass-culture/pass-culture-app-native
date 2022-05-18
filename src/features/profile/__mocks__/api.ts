import { beneficiaryUser } from 'fixtures/user'

export enum CHANGE_EMAIL_ERROR_CODE {
  TOKEN_EXISTS = 'TOKEN_EXISTS',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  EMAIL_UPDATE_ATTEMPTS_LIMIT = 'EMAIL_UPDATE_ATTEMPTS_LIMIT',
}

export const useUserProfileInfo = jest.fn().mockReturnValue({
  data: beneficiaryUser,
})
