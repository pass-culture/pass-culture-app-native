import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import {
  sanitizeSearchStateParams,
  sanitizedSearchStateRequiredDefaults,
} from 'features/search/utils/sanitizeSearchStateParams'

describe('sanitizeSearchStateParams', () => {
  it('should include default required sanitized params', () => {
    expect(sanitizeSearchStateParams()).toEqual(sanitizedSearchStateRequiredDefaults)
  })

  it('should sanitize query to empty string when not provided', () => {
    const searchStateParams = sanitizeSearchStateParams({ query: 'test' })
    expect(searchStateParams).toEqual({ ...sanitizedSearchStateRequiredDefaults, query: 'test' })
    const emptySearchStateParams = sanitizeSearchStateParams({})
    expect(emptySearchStateParams).toEqual({ ...sanitizedSearchStateRequiredDefaults, query: '' })
  })

  it('should sanitize offerCategories to empty array when not provided', () => {
    let { offerCategories } = sanitizeSearchStateParams({ offerCategories: ['CINEMA'] })
    expect(offerCategories).toEqual(['CINEMA'])
    offerCategories = sanitizeSearchStateParams({ offerCategories: undefined }).offerCategories
    expect(offerCategories).toEqual([])
    expect(offerCategories).not.toBeUndefined()
  })

  it('should sanitize geolocation to null when not provided', () => {
    let { geolocation } = sanitizeSearchStateParams({
      geolocation: { latitude: 10, longitude: 5 },
    })
    expect(geolocation).toEqual({ latitude: 10, longitude: 5 })
    geolocation = sanitizeSearchStateParams({ geolocation: undefined }).geolocation
    expect(geolocation).toBeNull()
  })

  it('should sanitize tags to empty array when not provided', () => {
    const sanitizedSearchStateParams = sanitizeSearchStateParams({ tags: ['special'] })
    expect(sanitizedSearchStateParams).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      tags: ['special'],
    })
    const undefParams = sanitizeSearchStateParams({ tags: undefined })
    expect(undefParams).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      tags: sanitizedSearchStateRequiredDefaults.tags,
    })
    expect(undefParams.tags).not.toBeUndefined()
  })

  it.each`
    parameter              | value
    ${`aroundRadius`}      | ${`100`}
    ${`beginningDatetime`} | ${new Date('2021-01-01')}
    ${`date`}              | ${new Date('2021-01-01')}
    ${`endingDatetime`}    | ${new Date('2021-01-01')}
    ${`offerIsDuo`}        | ${true}
    ${`offerIsFree`}       | ${true}
    ${`offerIsNew`}        | ${true}
    ${`place`}             | ${'Paris'}
    ${`showResults`}       | ${true}
    ${`timeRange`}         | ${[0, 24]}
    ${`venueId`}           | ${1337}
  `(
    'should sanitize parameter $parameter to "$value" when set and to "undefined" when undefined',
    ({
      parameter,
      value,
    }: {
      parameter: keyof SearchState
      value: boolean | number | string | Date | Record<string, unknown> | undefined | null
    }) => {
      const definedParams = sanitizeSearchStateParams({ [parameter]: value })
      expect(definedParams[parameter]).toEqual(value)

      const undefinedParams = sanitizeSearchStateParams({ [parameter]: undefined })
      expect(undefinedParams[parameter]).toBeUndefined()
    }
  )

  it.each<Array<LocationType>>([
    [LocationType.PLACE, LocationType.AROUND_ME, LocationType.EVERYWHERE],
  ])(`should sanitize locationType if %s is ${LocationType.EVERYWHERE}`, (locationType) => {
    const sanitizedSearchStateParams = sanitizeSearchStateParams({
      locationType: locationType as LocationType,
    })
    expect(sanitizedSearchStateParams).toEqual({
      ...(locationType === LocationType.EVERYWHERE ? {} : { locationType }),
      ...sanitizedSearchStateRequiredDefaults,
    })
  })

  it('should sanitize offerTypes when passed', () => {
    const sanitizedSearchStateParams = sanitizeSearchStateParams({
      offerTypes: {
        isEvent: true,
        isDigital: false,
      },
    })
    expect(sanitizedSearchStateParams).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      offerTypes: {
        isEvent: true,
      },
    })
  })

  it('should sanitize priceRange and clampPrice', () => {
    const sanitizedSearchStateParams = sanitizeSearchStateParams({
      priceRange: [0, 500],
    })
    expect(sanitizedSearchStateParams).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      priceRange: [0, 300],
    })
  })
})
