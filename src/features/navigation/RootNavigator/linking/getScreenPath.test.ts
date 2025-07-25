import { getScreenPath } from './getScreenPath'

jest.mock('libs/firebase/analytics/analytics')

describe('getScreenPath()', () => {
  const SearchStack = {
    screen: 'SearchStackNavigator',
    params: { screen: 'SearchLanding', params: undefined },
  }

  it.each`
    screen                             | params                                          | expectedPath
    ${'TabNavigator'}                  | ${{ screen: 'Home' }}                           | ${'/accueil'}
    ${'TabNavigator'}                  | ${{ screen: 'Profile' }}                        | ${'/profil'}
    ${'TabNavigator'}                  | ${SearchStack}                                  | ${'/recherche/accueil'}
    ${'Offer'}                         | ${{ id: 666, from: 'offer' }}                   | ${'/offre/666?from=offer'}
    ${'UnknownScreen'}                 | ${undefined}                                    | ${'/UnknownScreen'}
    ${'ProfileStackNavigator'}         | ${{ screen: 'Accessibility' }}                  | ${'/accessibilite'}
    ${'OnboardingStackNavigator'}      | ${{ screen: 'OnboardingGeneralPublicWelcome' }} | ${'/bienvenue-grand-public'}
    ${'SignupConfirmationExpiredLink'} | ${{ email: 'test@test.fr' }}                    | ${'/email-confirmation-creation-compte/expire?email=test%40test.fr'}
  `(
    `should return $expectedPath when screen=$screen and params=$params`,
    ({ screen, params, expectedPath }) => {
      expect(getScreenPath(screen, params)).toEqual(expectedPath)
    }
  )
})
