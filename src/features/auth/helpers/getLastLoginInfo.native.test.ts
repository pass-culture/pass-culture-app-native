import { getLastLoginInfo } from 'features/auth/helpers/getLastLoginInfo'
import { Provider } from 'features/auth/types'
import { storage } from 'libs/storage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Apple } from 'ui/svg/icons/socialNetwork/Apple'
import { Google } from 'ui/svg/icons/socialNetwork/Google'

jest.mock('libs/storage', () => ({ storage: { readObject: jest.fn() } }))

describe('getLastLoginInfo', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should return null when no login information is stored', async () => {
    jest.mocked(storage.readObject).mockResolvedValueOnce(null)

    await expect(getLastLoginInfo()).resolves.toBeNull()

    expect(storage.readObject).toHaveBeenCalledWith('last_login_info')
  })

  describe('when the provider is Google', () => {
    it('should return the Google provider label and icon', async () => {
      jest.mocked(storage.readObject).mockResolvedValueOnce({
        maskedEmail: 'rog*************@gmail.com',
        provider: Provider.GOOGLE,
        lastLoginAt: '2026-08-17T14:11:41.595Z',
      })

      await expect(getLastLoginInfo()).resolves.toEqual({
        maskedEmail: 'rog*************@gmail.com',
        provider: { label: 'Google', icon: Google, type: Provider.GOOGLE },
        lastLoginAt: '17/08/2026',
      })
    })
  })

  describe('when the provider is Apple', () => {
    it('should return the Apple provider label and icon', async () => {
      jest.mocked(storage.readObject).mockResolvedValueOnce({
        maskedEmail: 'rog*************@apple.com',
        provider: Provider.APPLE,
        lastLoginAt: '2026-08-17T14:11:41.595Z',
      })

      await expect(getLastLoginInfo()).resolves.toEqual({
        maskedEmail: 'rog*************@apple.com',
        provider: { label: 'Apple', icon: Apple, type: Provider.APPLE },
        lastLoginAt: '17/08/2026',
      })
    })
  })

  describe('when the provider is email', () => {
    it('should return the email provider label and icon', async () => {
      jest.mocked(storage.readObject).mockResolvedValueOnce({
        maskedEmail: 'rog*************@gmail.com',
        provider: Provider.EMAIL,
        lastLoginAt: '2026-08-17T14:11:41.595Z',
      })

      await expect(getLastLoginInfo()).resolves.toEqual({
        maskedEmail: 'rog*************@gmail.com',
        provider: { label: 'E-mail', icon: EmailFilled, type: Provider.EMAIL },
        lastLoginAt: '17/08/2026',
      })
    })
  })

  describe('when the last login date is invalid', () => {
    it('should return an empty lastLoginAt', async () => {
      jest.mocked(storage.readObject).mockResolvedValueOnce({
        maskedEmail: 'rog*************@gmail.com',
        provider: Provider.EMAIL,
        lastLoginAt: 'invalid-date',
      })

      await expect(getLastLoginInfo()).resolves.toEqual({
        maskedEmail: 'rog*************@gmail.com',
        provider: { label: 'E-mail', icon: EmailFilled, type: Provider.EMAIL },
        lastLoginAt: '',
      })
    })
  })

  describe('when the provider is invalid', () => {
    it('should return null', async () => {
      jest.mocked(storage.readObject).mockResolvedValueOnce({
        maskedEmail: 'rog*************@gmail.com',
        provider: 'invalid-provider' as Provider,
        lastLoginAt: '2026-08-17T14:11:41.595Z',
      })

      await expect(getLastLoginInfo()).resolves.toBeNull()
    })
  })
})
