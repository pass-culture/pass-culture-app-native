import { renderHook } from '@testing-library/react-hooks'

import { useValidateEmail } from './useValidateEmail'

const currentUserEmail = 'current@gmail.com'
const newUserEmail = 'new@gmail.com'
const invalidNewUserEmail = 'new@invaild'

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { email: currentUserEmail } })),
}))

describe('useValidateEmail function', () => {
  beforeEach(jest.clearAllMocks)

  it('should not return an error message if the new email is valid', () => {
    const { result } = renderHook(() => useValidateEmail(newUserEmail))
    expect(result.current).toEqual({ hasError: false, message: '' })
  })

  it('should return an error message if the new email is invalid', () => {
    const { result } = renderHook(() => useValidateEmail(invalidNewUserEmail))
    expect(result.current).toEqual({
      hasError: true,
      message: "Format de l'e-mail incorrect",
    })
  })

  it('should return an error message if the new email is the same than the new one ', () => {
    const { result } = renderHook(() => useValidateEmail(currentUserEmail))
    expect(result.current).toEqual({
      hasError: true,
      message: "L'e-mail saisi est identique à votre e-mail actuel",
    })
  })
})
