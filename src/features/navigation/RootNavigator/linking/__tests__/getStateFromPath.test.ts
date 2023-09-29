import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { linking } from 'features/navigation/RootNavigator/linking'
import { customGetStateFromPath } from 'features/navigation/RootNavigator/linking/getStateFromPath'
import { analytics } from 'libs/analytics'
// eslint-disable-next-line no-restricted-imports
import { firebaseAnalytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { storeUtmParams } from 'libs/utm'
import { waitFor } from 'tests/utils'

jest.mock('libs/utm', () => ({ storeUtmParams: jest.fn() }))

const COOKIES_CONSENT_KEY = 'cookies'

describe('getStateFromPath()', () => {
  it('should return state for path accueil', async () => {
    const path = 'accueil'
    const state = customGetStateFromPath(path, linking.config)
    const expectedState = {
      routes: [
        {
          name: 'TabNavigator',
          state: { routes: [{ name: 'Home', path }] },
        },
      ],
    }

    await waitFor(() => {
      expect(state).toEqual(expectedState)
    })
  })

  it('should return state for path offre/777', async () => {
    const path = 'offre/777'
    const state = customGetStateFromPath(path, linking.config)
    const expectedState = { routes: [{ name: 'Offer', params: { id: 777 }, path }] }

    await waitFor(() => {
      expect(state).toEqual(expectedState)
      expect(analytics.logConsultOffer).toBeCalledWith({ offerId: 777, from: 'deeplink' })
    })
  })

  describe('utm params', () => {
    describe('user has accepted customization cookies', () => {
      beforeAll(() => {
        storage.saveObject(COOKIES_CONSENT_KEY, {
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: COOKIES_BY_CATEGORY.customization,
            refused: [...COOKIES_BY_CATEGORY.performance, ...COOKIES_BY_CATEGORY.marketing],
          },
        })
      })

      it('should save utm parameters in storage if available - offers', async () => {
        customGetStateFromPath(
          'offre/1188?utm_campaign=push_offre_local&utm_gen=marketing&utm_medium=batch&utm_source=push',
          linking.config
        )

        await waitFor(() => {
          expect(storeUtmParams).toBeCalledWith({
            campaign: 'push_offre_local',
            gen: 'marketing',
            source: 'push',
            medium: 'batch',
          })
          expect(firebaseAnalytics.setDefaultEventParameters).toBeCalledWith({
            traffic_campaign: 'push_offre_local',
            traffic_gen: 'marketing',
            traffic_source: 'push',
            traffic_medium: 'batch',
          })
        })
      })

      it('should save utm parameters in storage if available - search', async () => {
        customGetStateFromPath(
          'recherche/?isDuo=true&utm_campaign=push_offre&utm_gen=marketing',
          linking.config
        )

        await waitFor(() => {
          expect(storeUtmParams).toBeCalledWith({
            campaign: 'push_offre',
            gen: 'marketing',
          })
          expect(firebaseAnalytics.setDefaultEventParameters).toBeCalledWith({
            traffic_campaign: 'push_offre',
            traffic_gen: 'marketing',
            traffic_source: undefined,
            traffic_medium: undefined,
          })
        })
      })

      it('should not save utm parameters in storage if not available', async () => {
        customGetStateFromPath('offre/1188', linking.config)

        await waitFor(() => {
          expect(storeUtmParams).not.toBeCalled()
          expect(firebaseAnalytics.setDefaultEventParameters).toBeCalledWith({
            traffic_campaign: undefined,
            traffic_gen: undefined,
            traffic_source: undefined,
            traffic_medium: undefined,
          })
        })
      })
    })

    describe('user has refused customization cookies', () => {
      beforeAll(() => {
        storage.saveObject(COOKIES_CONSENT_KEY, {
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: [...COOKIES_BY_CATEGORY.performance, ...COOKIES_BY_CATEGORY.marketing],
            refused: COOKIES_BY_CATEGORY.customization,
          },
        })
      })

      it('should not save utm parameters in storage', async () => {
        customGetStateFromPath(
          'offre/1188?utm_campaign=push_offre_local&utm_gen=marketing&utm_medium=batch&utm_source=push',
          linking.config
        )

        await waitFor(() => {
          expect(storeUtmParams).not.toHaveBeenCalled()
          expect(firebaseAnalytics.setDefaultEventParameters).toBeCalledWith({
            traffic_campaign: undefined,
            traffic_gen: undefined,
            traffic_source: undefined,
            traffic_medium: undefined,
          })
        })
      })
    })
  })
})
