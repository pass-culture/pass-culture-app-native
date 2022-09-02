import mockdate from 'mockdate'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { api } from 'api/api'
import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, fireEvent, flushAllPromisesWithAct, waitFor } from 'tests/utils'

const COOKIES_CONSENT_KEY = 'cookies_consent'
const hideModal = jest.fn()
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const deviceId = 'testUuidV4'

jest.mock('api/api')
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), push: jest.fn() }),
  useFocusEffect: jest.fn(),
}))

describe('<CookiesConsent/>', () => {
  beforeEach(() => storage.clear(COOKIES_CONSENT_KEY))

  it('should render correctly', async () => {
    const renderAPI = renderCookiesConsent()
    expect(renderAPI).toMatchSnapshot()
  })

  describe('accept all cookies', () => {
    it('should save cookies consent information in storage and log choice when accepted all cookies', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)

      await flushAllPromisesWithAct()

      const storageContent = {
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      }
      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
      await waitForExpect(() =>
        expect(api.postnativev1cookiesConsent).toBeCalledWith(storageContent)
      )
    })

    it('should hide modale when accepted all cookies', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)
      await flushAllPromisesWithAct()

      expect(hideModal).toBeCalled()
    })
  })

  describe('refuse all cookies', () => {
    it('should save cookies consent information in storage and log choice when user refused all cookies', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout refuser')

      fireEvent.press(acceptAllButton)

      await flushAllPromisesWithAct()

      const storageContent = {
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: [],
          refused: ALL_OPTIONAL_COOKIES,
        },
      }
      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
      await waitForExpect(() =>
        expect(api.postnativev1cookiesConsent).toBeCalledWith(storageContent)
      )
    })

    it('should hide modale when user refused all cookies', async () => {
      const { getByText } = renderCookiesConsent()
      const acceptAllButton = getByText('Tout refuser')

      fireEvent.press(acceptAllButton)
      await flushAllPromisesWithAct()

      expect(hideModal).toBeCalled()
    })
  })

  describe('make detailled cookie choice', () => {
    it('should save cookies consent information in storage and log choice when user partially accepts cookies', async () => {
      const { getByText, getByTestId } = renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const performanceSwitch = getByTestId('Interrupteur-performance')
      fireEvent.press(performanceSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)

      const storageContent = {
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: COOKIES_BY_CATEGORY.performance,
          refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.marketing],
        },
      }
      await waitFor(async () => {
        expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual(storageContent)
        expect(api.postnativev1cookiesConsent).toBeCalledWith(storageContent)
      })
    })

    it('should hide modale when user saves cookies choice', async () => {
      const { getByText } = await renderCookiesConsent()

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)
      await flushAllPromisesWithAct()

      expect(hideModal).toBeCalled()
    })
  })
})

const renderCookiesConsent = () =>
  render(<CookiesConsent visible={true} hideModal={hideModal} />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
