import { SearchGroupNameEnumv2 } from 'api/gen'
import { getUniversalLink } from 'features/navigation/navigators/RootNavigator/linking/getUniversalLink'

jest.mock('libs/firebase/analytics/analytics')

describe('getUniversalLink', () => {
  it('should get universal link from root screen', () => {
    const universalLink = getUniversalLink(
      'VenueMap',
      { from: 'deeplink', utm_gen: 'marketing' },
      'app.testing.passculture.team'
    )

    expect(universalLink).toEqual(
      'https://app.testing.passculture.team/carte-des-lieux?from=deeplink&utm_gen=marketing'
    )
  })

  it('should get universal link from tab screen', () => {
    const universalLink = getUniversalLink(
      'Profile',
      { from: 'deeplink', utm_gen: 'marketing' },
      'app.testing.passculture.team'
    )

    expect(universalLink).toEqual(
      'https://app.testing.passculture.team/profil?from=deeplink&utm_gen=marketing'
    )
  })

  it('should get universal link from search screen', () => {
    const universalLink = getUniversalLink(
      'ThematicSearch',
      { from: 'deeplink', offerCategories: [SearchGroupNameEnumv2.CINEMA], utm_gen: 'marketing' },
      'app.testing.passculture.team'
    )

    expect(universalLink).toEqual(
      'https://app.testing.passculture.team/recherche/thematique?from=deeplink&offerCategories=%5B%22CINEMA%22%5D&utm_gen=marketing'
    )
  })
})
