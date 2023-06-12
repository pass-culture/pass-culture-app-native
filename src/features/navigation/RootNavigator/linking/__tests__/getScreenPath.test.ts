import { getScreenPath } from '../getScreenPath'

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
