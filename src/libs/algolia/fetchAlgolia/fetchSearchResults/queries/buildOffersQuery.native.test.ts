import { BuildOffersQueryArgs } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildOffersQueryBase'

import { buildOffersQuery } from './buildOffersQuery'

describe('buildOffersQuery', () => {
  it('should return the base configuration with provided hitsPerPage', () => {
    const args = {
      parameters: { hitsPerPage: 42 },
      buildLocationParameterParams: {},
      isUserUnderage: false,
      disabilitiesProperties: {},
    }

    const result = buildOffersQuery(args as BuildOffersQueryArgs)

    expect(result.hitsPerPage).toBe(42)
  })
})
