import { getScreenPath } from './getScreenPath'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('getScreenPath()', () => {
  it.each`
    screen             | params                        | expectedPath
    ${'TabNavigator'}  | ${{ screen: 'Home' }}         | ${'/accueil'}
    ${'TabNavigator'}  | ${{ screen: 'Profile' }}      | ${'/profil'}
    ${'Offer'}         | ${{ id: 666, from: 'offer' }} | ${'/offre/666?from=offer'}
    ${'UnknownScreen'} | ${undefined}                  | ${'/UnknownScreen'}
  `(
    `should return $expectedPath when screen=$screen and params=$params`,
    ({ screen, params, expectedPath }) => {
      expect(getScreenPath(screen, params)).toEqual(expectedPath)
    }
  )
})
