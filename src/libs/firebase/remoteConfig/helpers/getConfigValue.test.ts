import { getConfigValue } from 'libs/firebase/remoteConfig/helpers/getConfigValue'

describe('getConfigValue', () => {
  it('should return the value if defined and the type is correct', () => {
    const value = {
      getSource: jest.fn(),
      asNumber: jest.fn(),
      asBoolean: jest.fn(),
      asString: jest.fn(),
    }

    expect(getConfigValue(value)).toBe(value)
  })

  it('should return default config value', () => {
    const value = getConfigValue()

    expect(value.asBoolean()).toBe(false)
    expect(value.asNumber()).toBe(0)
    expect(value.asString()).toBe('')
    expect(value.getSource()).toBe('static')
  })
})
