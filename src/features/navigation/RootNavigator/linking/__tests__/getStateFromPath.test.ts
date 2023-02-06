import waitForExpect from 'wait-for-expect'

import { COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { linking } from 'features/navigation/RootNavigator/linking'
import { customGetStateFromPath } from 'features/navigation/RootNavigator/linking/getStateFromPath'
import { analytics } from 'libs/firebase/analytics'
import { storage } from 'libs/storage'
import { storeUtmParams } from 'libs/utm'

jest.mock('libs/utm', () => ({ storeUtmParams: jest.fn() }))

const COOKIES_CONSENT_KEY = 'cookies'

describe('getStateFromPath()', () => {
  it('should return state for path accueil?entryId=666', async () => {
    const path = 'accueil?entryId=666'
    const state = customGetStateFromPath(path, linking.config)
    const expectedState = {
      routes: [
        {
          name: 'TabNavigator',
          state: { routes: [{ name: 'Home', params: { entryId: '666' }, path }] },
        },
      ],
    }
    await waitForExpect(() => {
      expect(state).toEqual(expectedState)
    })
  })

  it('should return state for path offre/777', async () => {
    const path = 'offre/777'
    const state = customGetStateFromPath(path, linking.config)
    const expectedState = { routes: [{ name: 'Offer', params: { id: 777 }, path }] }
    await waitForExpect(() => {
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
          'offre/1188?utm_campaign=push_offre_local&utm_medium=batch&utm_source=push',
          linking.config
        )
        await waitForExpect(() => {
          expect(storeUtmParams).toBeCalledWith({
            campaign: 'push_offre_local',
            source: 'push',
            medium: 'batch',
          })
          expect(analytics.setDefaultEventParameters).toBeCalledWith({
            traffic_campaign: 'push_offre_local',
            traffic_source: 'push',
            traffic_medium: 'batch',
          })
        })
      })

      it('should save utm parameters in storage if available - search', async () => {
        customGetStateFromPath('recherche/?isDuo=true&utm_campaign=push_offre', linking.config)
        await waitForExpect(() => {
          expect(storeUtmParams).toBeCalledWith({ campaign: 'push_offre' })
          expect(analytics.setDefaultEventParameters).toBeCalledWith({
            traffic_campaign: 'push_offre',
            traffic_source: undefined,
            traffic_medium: undefined,
          })
        })
      })

      it('should not save utm parameters in storage if not available', async () => {
        customGetStateFromPath('offre/1188', linking.config)
        await waitForExpect(() => {
          expect(storeUtmParams).not.toBeCalled()
          expect(analytics.setDefaultEventParameters).toBeCalledWith({
            traffic_campaign: undefined,
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
          'offre/1188?utm_campaign=push_offre_local&utm_medium=batch&utm_source=push',
          linking.config
        )
        await waitForExpect(() => {
          expect(storeUtmParams).not.toHaveBeenCalled()
          expect(analytics.setDefaultEventParameters).toBeCalledWith({
            traffic_campaign: undefined,
            traffic_source: undefined,
            traffic_medium: undefined,
          })
        })
      })
    })
  })
})
