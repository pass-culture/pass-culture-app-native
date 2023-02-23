import { track, setOptOut, identify } from '@amplitude/analytics-react-native'

import { amplitude } from './amplitude'

jest.unmock('./amplitude')

jest.mock('@amplitude/analytics-react-native', () => ({
  init: jest.fn(),
  track: jest.fn(),
  setOptOut: jest.fn(),
  identify: jest.fn(),
  Types: jest.requireActual('@amplitude/analytics-react-native').Types,
  Identify: jest.requireActual('@amplitude/analytics-react-native').Identify,
}))
const mockIdentify = identify as jest.Mock

describe('amplitude', () => {
  it('should send an event with its properties on logEvent call', () => {
    amplitude.logEvent('eventName', { property1: 'toto', property2: 123 })

    expect(track).toHaveBeenNthCalledWith(1, 'eventName', { property1: 'toto', property2: 123 })
  })

  it('should send an event on logEvent call without properties', () => {
    amplitude.logEvent('eventName')

    expect(track).toHaveBeenNthCalledWith(1, 'eventName', undefined)
  })

  it('should opt in the user on enableCollection call', () => {
    amplitude.enableCollection()

    expect(setOptOut).toHaveBeenNthCalledWith(1, false)
  })

  it('should opt out the user on disableCollection call', () => {
    amplitude.disableCollection()

    expect(setOptOut).toHaveBeenNthCalledWith(1, true)
  })

  it('should set user properties on setUserProperties call', () => {
    amplitude.setUserProperties({ property1: 'toto', property2: 123 })

    // We get the user properties from the `Identify` object the `identify` method is first called with
    const receivedIdentify = mockIdentify.mock.calls?.[0]?.[0]
    const receivedUserProperties = receivedIdentify.getUserProperties().$set

    expect(receivedUserProperties).toEqual({ property1: 'toto', property2: 123 })
  })

  it('should set user properties on setUserProperties call, ignoring null value', () => {
    amplitude.setUserProperties({ property1: 'toto', property2: null })

    // We get the user properties from the `Identify` object the `identify` method is first called with
    const receivedIdentify = mockIdentify.mock.calls?.[0]?.[0]
    const receivedUserProperties = receivedIdentify.getUserProperties().$set

    expect(receivedUserProperties).toEqual({ property1: 'toto' })
  })
})
