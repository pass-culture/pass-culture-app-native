import { SubcategoryIdEnum } from 'api/gen'
import { UserProps, getDistance } from 'libs/location/getDistance'
import { LocationMode } from 'libs/location/types'

const OFFER_POSITION = { lat: 91, lng: 91 }
const UNDEFINED_OFFER_POSITION = {
  lat: undefined,
  lng: undefined,
}
const DEFAULT_USER_LOCATION = { latitude: 90, longitude: 90 }

const USER_POSITION = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: null,
  selectedLocationMode: LocationMode.AROUND_ME,
}
const UNDEFINED_USER_POSITION = {
  userLocation: null,
  selectedPlace: null,
  selectedLocationMode: LocationMode.EVERYWHERE,
}

const USER_MUNICIPALITY_POSITION: UserProps = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: {
    type: 'municipality',
    label: 'Kourou',
    info: 'Kourou',
    geolocation: DEFAULT_USER_LOCATION,
  },
  selectedLocationMode: LocationMode.AROUND_PLACE,
}

const USER_PRECISE_PLACE_POSITION: UserProps = {
  ...USER_MUNICIPALITY_POSITION,
  selectedPlace: {
    type: 'housenumber',
    label: 'Kourou',
    info: 'Kourou',
    geolocation: DEFAULT_USER_LOCATION,
  },
}

describe('getDistance()', () => {
  it.each`
    offerPosition               | userPosition                   | expectedResult
    ${OFFER_POSITION}           | ${USER_POSITION}               | ${'111 km'}
    ${UNDEFINED_OFFER_POSITION} | ${USER_POSITION}               | ${undefined}
    ${OFFER_POSITION}           | ${UNDEFINED_USER_POSITION}     | ${undefined}
    ${OFFER_POSITION}           | ${USER_MUNICIPALITY_POSITION}  | ${undefined}
    ${OFFER_POSITION}           | ${USER_PRECISE_PLACE_POSITION} | ${'111 km'}
  `(
    'should return $expectedResult when offerPosition is $offerPosition and userPosition $userPosition',
    ({ offerPosition, userPosition, expectedResult }) => {
      expect(getDistance(offerPosition, userPosition)).toEqual(expectedResult)
    }
  )

  it('should return undefined when the offer is an online offer', () => {
    const ONLINE_OFFER_SUBCATEGORY_ID = SubcategoryIdEnum.PODCAST

    const distance = getDistance(OFFER_POSITION, USER_POSITION, ONLINE_OFFER_SUBCATEGORY_ID)

    expect(distance).toBeUndefined()
  })
})
