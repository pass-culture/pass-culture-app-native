import { getProviderName } from 'features/auth/helpers/getProviderName'
import { Provider } from 'features/auth/types'

describe('getProviderName', () => {
  it.each<[Provider.GOOGLE | Provider.APPLE | undefined, string]>([
    [Provider.APPLE, 'Apple'],
    [Provider.GOOGLE, 'Google'],
    [undefined, 'Google ou Apple'],
  ])('should return the name of provider %s', (provider, expected) => {
    expect(getProviderName(provider)).toBe(expected)
  })
})
