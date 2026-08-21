import { maskEmail } from 'features/auth/helpers/maskEmail'
import { Provider } from 'features/auth/types'
import { storage } from 'libs/storage'

import { saveLastLoginInfo } from './saveLastLoginInfo'

jest.mock('libs/storage', () => ({ storage: { saveObject: jest.fn() } }))

jest.mock('features/auth/helpers/maskEmail', () => ({ maskEmail: jest.fn() }))

const date = new Date('2026-08-17T13:09:00.000Z')
jest.spyOn(global, 'Date').mockImplementation(() => date as unknown as Date)
;(maskEmail as jest.Mock).mockReturnValue('ann*******@gmail.com')

describe('saveLastLoginInfo', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should save the masked email, provider and login date', async () => {
    await saveLastLoginInfo({
      email: 'anne-onime@gmail.com',
      provider: Provider.GOOGLE,
    })

    expect(storage.saveObject).toHaveBeenCalledWith('last_login_info', {
      maskedEmail: 'ann*******@gmail.com',
      provider: Provider.GOOGLE,
      lastLoginAt: date.toISOString(),
    })
  })
})
