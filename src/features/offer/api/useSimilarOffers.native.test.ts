import { SearchGroupNameEnumv2, SimilarOffersResponse } from 'api/gen'
import * as useAlgoliaSimilarOffers from 'features/offer/api/useAlgoliaSimilarOffers'
import { getCategories, useSimilarOffers } from 'features/offer/api/useSimilarOffers'
import { env } from 'libs/environment/fixtures'
import * as PackageJson from 'libs/packageJson'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/react-native-device-info/getDeviceId')
const mockOfferId = 1
const position = {
  latitude: 6,
  longitude: 22,
}

jest.mock('features/auth/context/AuthContext')

const mockSearchGroups = PLACEHOLDER_DATA.searchGroups
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      searchGroups: mockSearchGroups,
    },
  }),
}))

const algoliaSpy = jest
  .spyOn(useAlgoliaSimilarOffers, 'useAlgoliaSimilarOffers')
  .mockImplementation()
const fetchApiRecoSpy = jest.spyOn(global, 'fetch')

jest.spyOn(PackageJson, 'getAppVersion').mockReturnValue('1.10.5')

describe('useSimilarOffers', () => {
  describe('When success API response', () => {
    beforeEach(() => {
      mockServer.getApi<SimilarOffersResponse>(`/v1/recommendation/similar_offers/${mockOfferId}`, {
        params: {},
        results: [],
      })
    })

    it('should call Algolia hook with category included', async () => {
      renderHook(
        () =>
          useSimilarOffers({
            offerId: mockOfferId,
            position,
            categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )
      await waitFor(() => {
        expect(algoliaSpy).toHaveBeenCalledTimes(1)
      })
    })

    it('should call Algolia hook with category excluded', async () => {
      renderHook(
        () =>
          useSimilarOffers({
            offerId: mockOfferId,
            position,
            categoryExcluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )
      await waitFor(() => {
        expect(algoliaSpy).toHaveBeenCalledTimes(1)
      })
    })

    it('should call similar offers API when offer id provided and user share his position', async () => {
      renderHook(
        () =>
          useSimilarOffers({
            offerId: mockOfferId,
            categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            position: { latitude: 10, longitude: 15 },
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(fetchApiRecoSpy).toHaveBeenNthCalledWith(
          1,
          `${env.API_BASE_URL}/native/v1/recommendation/similar_offers/1?longitude=15&latitude=10&categories=FILMS_SERIES_CINEMA`,
          {
            credentials: 'omit',
            headers: {
              'app-version': '1.10.5',
              'code-push-id': 'abel',
              'commit-hash': '13371337',
              'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
              platform: 'ios',
              'request-id': 'testUuidV4',
            },
            method: 'GET',
          }
        )
      })
    })

    it('should call similar offers API when offer id provided and user not share his position', async () => {
      renderHook(
        () =>
          useSimilarOffers({
            offerId: mockOfferId,
            categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            position: null,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(fetchApiRecoSpy).toHaveBeenNthCalledWith(
          1,
          `${env.API_BASE_URL}/native/v1/recommendation/similar_offers/1?categories=FILMS_SERIES_CINEMA`,
          {
            credentials: 'omit',
            headers: {
              'app-version': '1.10.5',
              'code-push-id': 'abel',
              'commit-hash': '13371337',
              'device-id': 'ad7b7b5a169641e27cadbdb35adad9c4ca23099a',
              platform: 'ios',
              'request-id': 'testUuidV4',
            },
            method: 'GET',
          }
        )
      })
    })
  })

  describe('When error API response', () => {
    beforeEach(() => {
      mockServer.getApi<SimilarOffersResponse>(`/v1/recommendation/similar_offers/${mockOfferId}`, {
        responseOptions: { statusCode: 503 },
      })
    })

    it('should return empty params and undefined similar offers when fetch similar offers call fails', async () => {
      const { result } = renderHook(
        () =>
          useSimilarOffers({
            offerId: mockOfferId,
            categoryIncluded: SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
            position: null,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(result.current).toEqual({ apiRecoParams: {}, similarOffers: undefined })
      })
    })
  })
})

describe('getCategories', () => {
  describe('should return an empty array', () => {
    it('when categoryIncluded and categoryExcluded not defined', () => {
      const categories = getCategories()

      expect(categories).toEqual([])
    })

    it('when categoryExcluded defined but not searchGroups', () => {
      const categories = getCategories(undefined, undefined, SearchGroupNameEnumv2.CARTES_JEUNES)

      expect(categories).toEqual([])
    })
  })

  it('should return an array with category of categoryIncluded parameter when defined', () => {
    const categories = getCategories(mockSearchGroups, SearchGroupNameEnumv2.CARTES_JEUNES)

    expect(categories).toEqual([SearchGroupNameEnumv2.CARTES_JEUNES])
  })

  it('should return an array with all categories except none category and categoryExcluded parameter when it is defined', () => {
    const categories = getCategories(
      mockSearchGroups,
      undefined,
      SearchGroupNameEnumv2.CARTES_JEUNES
    )

    expect(categories).toEqual([
      SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE,
      SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
      SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
      SearchGroupNameEnumv2.FILMS_SERIES_CINEMA,
      SearchGroupNameEnumv2.INSTRUMENTS,
      SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      SearchGroupNameEnumv2.LIVRES,
      SearchGroupNameEnumv2.MEDIA_PRESSE,
      SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      SearchGroupNameEnumv2.SPECTACLES,
    ])
  })
})
