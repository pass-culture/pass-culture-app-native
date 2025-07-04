import { onlineManager } from '@tanstack/react-query'

import { SearchGroupNameEnumv2, SimilarOffersResponse } from 'api/gen'
import { getCategories, useSimilarOffersQuery } from 'features/offer/queries/useSimilarOffersQuery'
import { env } from 'libs/environment/fixtures'
import { EmptyResponse } from 'libs/fetch'
import { eventMonitoring } from 'libs/monitoring/services'
import * as PackageJson from 'libs/packageJson'
import { searchGroupsDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import * as useAlgoliaSimilarOffersAPI from 'queries/offer/useAlgoliaSimilarOffersQuery'
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
jest.mock('libs/subcategories/useSubcategories')

const algoliaSpy = jest.spyOn(useAlgoliaSimilarOffersAPI, 'useAlgoliaSimilarOffersQuery')
const fetchApiRecoSpy = jest.spyOn(global, 'fetch')

jest.spyOn(PackageJson, 'getAppVersion').mockReturnValue('1.10.5')

jest.useFakeTimers()

describe('useSimilarOffersQuery', () => {
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
          useSimilarOffersQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            position,
            categoryIncluded: SearchGroupNameEnumv2.CINEMA,
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
          useSimilarOffersQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            position,
            categoryExcluded: SearchGroupNameEnumv2.CINEMA,
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
          useSimilarOffersQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            categoryIncluded: SearchGroupNameEnumv2.CINEMA,
            position: { latitude: 10, longitude: 15 },
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(fetchApiRecoSpy).toHaveBeenNthCalledWith(
          1,
          `${env.API_BASE_URL}/native/v1/recommendation/similar_offers/1?longitude=15&latitude=10&search_group_names=CINEMA`,
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
          useSimilarOffersQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            categoryIncluded: SearchGroupNameEnumv2.CINEMA,
            position: null,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(fetchApiRecoSpy).toHaveBeenNthCalledWith(
          1,
          `${env.API_BASE_URL}/native/v1/recommendation/similar_offers/1?search_group_names=CINEMA`,
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

    it('should not call similar offers API when offer id provided, user share his position and shouldFetch is false', () => {
      renderHook(
        () =>
          useSimilarOffersQuery({
            offerId: mockOfferId,
            shouldFetch: false,
            categoryIncluded: SearchGroupNameEnumv2.CINEMA,
            position: { latitude: 10, longitude: 15 },
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      expect(fetchApiRecoSpy).not.toHaveBeenCalled()
    })
  })

  describe('When error API response', () => {
    it('should return empty params and undefined similar offers when fetch similar offers call fails', async () => {
      mockServer.getApi<EmptyResponse>(`/v1/recommendation/similar_offers/${mockOfferId}`, {
        responseOptions: { statusCode: 503, data: {} },
      })
      const { result } = renderHook(
        () =>
          useSimilarOffersQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            categoryIncluded: SearchGroupNameEnumv2.CINEMA,
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

  it('should capture an exception when fetch call fails', async () => {
    mockServer.getApi<EmptyResponse>(`/v1/recommendation/similar_offers/${mockOfferId}`, {
      responseOptions: { statusCode: 400, data: {} },
    })
    renderHook(
      () =>
        useSimilarOffersQuery({
          offerId: mockOfferId,
          shouldFetch: true,
          categoryIncluded: SearchGroupNameEnumv2.CINEMA,
          position: null,
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(
        new Error('Error 400 with recommendation endpoint to get similar offers'),
        {
          extra: {
            searchGroupNames: '["CINEMA"]',
            latitude: undefined,
            longitude: undefined,
            offerId: 1,
            statusCode: 400,
            errorMessage:
              'Échec de la requête https://localhost/native/v1/recommendation/similar_offers/1?search_group_names=CINEMA, code: 400',
          },
        }
      )
    })
  })

  it.each([
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ])(
    'should not capture an exception when fetch call fails if ApiError and error code is %s',
    async (statusCode) => {
      mockServer.getApi<EmptyResponse>(`/v1/recommendation/similar_offers/${mockOfferId}`, {
        responseOptions: { statusCode, data: {} },
      })
      renderHook(
        () =>
          useSimilarOffersQuery({
            offerId: mockOfferId,
            shouldFetch: true,
            categoryIncluded: SearchGroupNameEnumv2.CINEMA,
            position: null,
          }),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        expect(eventMonitoring.captureException).not.toHaveBeenCalled()
      })
    }
  )

  it('should not call API reco when connection is disabled', () => {
    onlineManager.setOnline(false)

    renderHook(
      () =>
        useSimilarOffersQuery({
          offerId: mockOfferId,
          shouldFetch: true,
          categoryIncluded: SearchGroupNameEnumv2.CINEMA,
          position: { latitude: 10, longitude: 15 },
        }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    expect(fetchApiRecoSpy).not.toHaveBeenCalled()
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
    const categories = getCategories(searchGroupsDataTest, SearchGroupNameEnumv2.CARTES_JEUNES)

    expect(categories).toEqual([SearchGroupNameEnumv2.CARTES_JEUNES])
  })

  it('should return an array with all categories except none category and categoryExcluded parameter when it is defined', () => {
    const categories = getCategories(
      searchGroupsDataTest,
      undefined,
      SearchGroupNameEnumv2.CARTES_JEUNES
    )

    expect(categories).toEqual([
      SearchGroupNameEnumv2.ARTS_LOISIRS_CREATIFS,
      SearchGroupNameEnumv2.MUSIQUE,
      SearchGroupNameEnumv2.CONCERTS_FESTIVALS,
      SearchGroupNameEnumv2.RENCONTRES_CONFERENCES,
      SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE,
      SearchGroupNameEnumv2.CINEMA,
      SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES,
      SearchGroupNameEnumv2.JEUX_JEUX_VIDEOS,
      SearchGroupNameEnumv2.LIVRES,
      SearchGroupNameEnumv2.MEDIA_PRESSE,
      SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
      SearchGroupNameEnumv2.SPECTACLES,
    ])
  })
})
