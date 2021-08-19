import { LocationType } from 'features/search/enums'
import {
  sanitizeSearchStateParams,
  sanitizedSearchStateRequiredDefaults,
} from 'features/search/utils/sanitizeSearchStateParams'

describe('sanitizeSearchStateParams', () => {
  it('should include default required sanitized params', () => {
    expect(sanitizeSearchStateParams()).toEqual(sanitizedSearchStateRequiredDefaults)
  })

  it('should sanitize query to empty string when not provided', () => {
    expect(sanitizeSearchStateParams({ query: 'test' })).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      query: 'test',
    })
    expect(sanitizeSearchStateParams({})).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      query: '',
    })
  })

  it('should sanitize offerCategories to empty array when not provided', () => {
    expect(
      sanitizeSearchStateParams({
        offerCategories: ['CINEMA'],
      })
    ).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      offerCategories: ['CINEMA'],
    })
    const undefParams = sanitizeSearchStateParams({
      offerCategories: undefined,
    })
    expect(undefParams).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      offerCategories: sanitizedSearchStateRequiredDefaults.offerCategories,
    })
    expect(undefParams.offerCategories).not.toBeUndefined()
  })

  it('should sanitize tags to empty array when not provided', () => {
    expect(
      sanitizeSearchStateParams({
        tags: ['special'],
      })
    ).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      tags: ['special'],
    })
    const undefParams = sanitizeSearchStateParams({
      tags: undefined,
    })
    expect(undefParams).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      tags: sanitizedSearchStateRequiredDefaults.tags,
    })
    expect(undefParams.offerCategories).not.toBeUndefined()
  })

  it.each`
    parameter              | value
    ${`aroundRadius`}      | ${`100`}
    ${`beginningDatetime`} | ${new Date('2021-01-01')}
    ${`date`}              | ${new Date('2021-01-01')}
    ${`endingDatetime`}    | ${new Date('2021-01-01')}
    ${`geolocation`}       | ${{ latitude: 10, longitude: 20 }}
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
      parameter: string
      value: boolean | number | string | Date | Record<string, unknown> | undefined | null
    }) => {
      expect(
        sanitizeSearchStateParams({
          [parameter]: value,
        })
      ).toEqual({
        ...sanitizedSearchStateRequiredDefaults,
        [parameter]: value,
      })
      expect(
        sanitizeSearchStateParams({
          [parameter]: undefined,
        })
      ).toEqual({
        ...sanitizedSearchStateRequiredDefaults,
        [parameter]: undefined,
      })
    }
  )

  it.each<Array<LocationType>>([
    [LocationType.PLACE, LocationType.AROUND_ME, LocationType.EVERYWHERE],
  ])(`should sanitize locationType if %s is ${LocationType.EVERYWHERE}`, (locationType) => {
    expect(
      sanitizeSearchStateParams({
        locationType: locationType as LocationType,
      })
    ).toEqual({
      ...(locationType === LocationType.EVERYWHERE ? {} : { locationType }),
      ...sanitizedSearchStateRequiredDefaults,
    })
  })

  it('should sanitize offerTypes when passed', () => {
    expect(
      sanitizeSearchStateParams({
        offerTypes: {
          isEvent: true,
          isDigital: false,
        },
      })
    ).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      offerTypes: {
        isEvent: true,
      },
    })
  })

  it('should sanitize priceRange and clampPrice', () => {
    expect(
      sanitizeSearchStateParams({
        priceRange: [0, 500],
      })
    ).toEqual({
      ...sanitizedSearchStateRequiredDefaults,
      priceRange: [0, 300],
    })
  })
})
