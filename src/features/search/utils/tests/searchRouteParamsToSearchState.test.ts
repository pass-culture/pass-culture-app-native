import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
import { searchRouteParamsToSearchState } from 'features/search/utils/searchRouteParamsToSearchState'

describe('searchRouteParamsToSearchState', () => {
  it('should return initialState when no params are provided', () => {
    expect(searchRouteParamsToSearchState({})).toStrictEqual(initialSearchState)
  })

  it.each`
    parameter              | value
    ${`aroundRadius`}      | ${100}
    ${`beginningDatetime`} | ${new Date('2021-01-01')}
    ${`date`}              | ${{ option: 'currentWeek', selectedDate: new Date('2021-02-01') }}
    ${`endingDatetime`}    | ${new Date('2021-03-01')}
    ${`geolocation`}       | ${{ latitude: 48.89, longitude: 2.35 }}
    ${`hitsPerPage`}       | ${50}
    ${`locationType`}      | ${LocationType.AROUND_ME}
    ${`offerCategories`}   | ${['CINEMA']}
    ${`offerIsDuo`}        | ${true}
    ${`offerIsFree`}       | ${true}
    ${`offerIsNew`}        | ${true}
    ${`offerTypes`}        | ${{ isDigital: true, isEvent: true, isThing: true }}
    ${`place`}             | ${'Paris'}
    ${`priceRange`}        | ${[0, 50]}
    ${`query`}             | ${'CGR'}
    ${`showResults`}       | ${true}
    ${`tags`}              | ${['new']}
    ${`venueId`}           | ${1337}
  `(
    'should override default search state "$parameter" with "$value" when set',
    ({
      parameter,
      value,
    }: {
      parameter: string
      value: boolean | number | string | Date | Record<string, unknown> | undefined | null
    }) => {
      const searchState = searchRouteParamsToSearchState({ [parameter]: value })
      expect(searchState[parameter as keyof SearchState]).not.toEqual(
        initialSearchState[parameter as keyof SearchState]
      )
    }
  )

  it.each([['isDigital', 'isEvent', 'isThing']])(
    `should apply offerTypes %s with initialSearchState.offerTypes defaults to searchState`,
    (offerType) => {
      expect(
        searchRouteParamsToSearchState({
          offerTypes: {
            [offerType]: true,
          },
        })
      ).toStrictEqual({
        ...initialSearchState,
        offerTypes: {
          ...initialSearchState.offerTypes,
          [offerType]: true,
        },
      })
    }
  )
})
