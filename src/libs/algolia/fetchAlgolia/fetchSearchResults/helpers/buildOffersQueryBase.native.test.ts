import { DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { env } from 'libs/environment/env'
import { LocationMode } from 'libs/location/types'

import { BuildOffersQueryArgs, buildOffersQueryBase } from './buildOffersQueryBase'

describe('buildOffersQueryBase', () => {
  const defaultArgs = {
    parameters: { query: 'Musique', page: 1, hitsPerPage: 20 },
    buildLocationParameterParams: {
      selectedLocationMode: LocationMode.EVERYWHERE,
      userLocation: null,
      aroundMeRadius: 0,
      aroundPlaceRadius: 0,
    },
    isUserUnderage: false,
    disabilitiesProperties: {
      [DisplayedDisabilitiesEnum.AUDIO]: false,
      [DisplayedDisabilitiesEnum.MENTAL]: false,
      [DisplayedDisabilitiesEnum.MOTOR]: false,
      [DisplayedDisabilitiesEnum.VISUAL]: false,
    },
  }

  it('should return index and parameters', () => {
    const result = buildOffersQueryBase(defaultArgs as BuildOffersQueryArgs)

    expect(result).toMatchObject({
      indexName: env.ALGOLIA_OFFERS_INDEX_NAME,
      query: 'Musique',
      page: 1,
      clickAnalytics: true,
      analytics: true,
    })
  })

  it('should include aroundPrecision only when provided', () => {
    const withPrecision = buildOffersQueryBase({
      ...defaultArgs,
      aroundPrecision: 100,
    } as BuildOffersQueryArgs)

    expect(withPrecision.aroundPrecision).toBe(100)

    const withoutPrecision = buildOffersQueryBase(defaultArgs as BuildOffersQueryArgs)

    expect(withoutPrecision.aroundPrecision).toBeUndefined()
  })
})
