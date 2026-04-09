import { BuildOffersQueryArgs } from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildOffersQueryBase'

import { buildDuplicatedOffersQuery } from './buildDuplicatedOffersQuery'

describe('buildDuplicatedOffersQuery', () => {
  const baseArgs = {
    parameters: { hitsPerPage: 20 },
    buildLocationParameterParams: {},
    isUserUnderage: false,
    disabilitiesProperties: {},
  }

  it.each`
    property           | expectedValue
    ${'hitsPerPage'}   | ${100}
    ${'distinct'}      | ${false}
    ${'typoTolerance'} | ${false}
  `(
    'should override $property to $expectedValue for duplicated offers search',
    ({ property, expectedValue }) => {
      const result = buildDuplicatedOffersQuery(baseArgs as BuildOffersQueryArgs)

      expect(result[property]).toBe(expectedValue)
    }
  )

  it('should keep other base properties intact', () => {
    const argsWithQuery = { ...baseArgs, parameters: { query: 'test' } }
    const result = buildDuplicatedOffersQuery(argsWithQuery as BuildOffersQueryArgs)

    expect(result.query).toBe('test')
    expect(result.clickAnalytics).toBe(true)
  })
})
