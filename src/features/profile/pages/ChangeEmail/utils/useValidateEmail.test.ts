import { renderHook } from '@testing-library/react-hooks'

import { useIsCurrentUserEmail, useValidateEmail } from './useValidateEmail'

const currentUserEmail = 'current@gmail.com'
const newUserEmail = 'new@gmail.com'
const invalidNewUserEmail = 'new@invaild'

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: { email: currentUserEmail } })),
}))

describe('useValidateEmail function', () => {
  it('should not return an error message if the new email is valid', () => {
    const { result } = renderHook(() => useValidateEmail(newUserEmail))
    expect(result.current.emailErrorMessage).toEqual(null)
    expect(result.current.isEmailValid).toEqual(true)
  })

  it('should return an error message if the new email is invalid', () => {
    const { result } = renderHook(() => useValidateEmail(invalidNewUserEmail))
    expect(result.current.emailErrorMessage).toEqual(
      "L'e-mail renseigné est incorrect. Exemple de format attendu\u00a0: edith.piaf@email.fr"
    )
    expect(result.current.isEmailValid).toEqual(false)
  })

  it('should return an error message if the new email is the same than the new one ', () => {
    const { result } = renderHook(() => useValidateEmail(currentUserEmail))
    expect(result.current.emailErrorMessage).toEqual(
      "L'e-mail saisi est identique à votre e-mail actuel"
    )
    expect(result.current.isEmailValid).toEqual(false)
  })

  it('should return a null error message if no email has been entered', () => {
    const { result } = renderHook(() => useValidateEmail(''))
    expect(result.current.emailErrorMessage).toEqual(null)
    expect(result.current.isEmailValid).toEqual(false)
  })
})

describe('useIsCurrentUserEmail function', () => {
  it('should return true if the current user email is the same than the new one', () => {
    const { result: isCurrentUserEmail } = renderHook(() => useIsCurrentUserEmail(currentUserEmail))
    expect(isCurrentUserEmail.current).toEqual(true)
  })

  it('should return false if the current user email is different than the new one', () => {
    const { result: isCurrentUserEmail } = renderHook(() => useIsCurrentUserEmail(newUserEmail))
    expect(isCurrentUserEmail.current).toEqual(false)
  })
})
