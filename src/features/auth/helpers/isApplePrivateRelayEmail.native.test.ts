import { isApplePrivateRelayEmail } from 'features/auth/helpers/isApplePrivateRelayEmail'

describe('isApplePrivateRelayEmail', () => {
  it.each(['abc123@privaterelay.appleid.com', 'ABC123@PrivateRelay.AppleID.com'])(
    'should return true for Apple private relay email %s',
    (email) => {
      expect(isApplePrivateRelayEmail(email)).toBe(true)
    }
  )

  it.each(['user@gmail.com', 'user@icloud.com', 'privaterelay.appleid.com@gmail.com'])(
    'should return false for email %s',
    (email) => {
      expect(isApplePrivateRelayEmail(email)).toBe(false)
    }
  )
})
