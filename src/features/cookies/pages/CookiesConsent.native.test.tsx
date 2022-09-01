import mockdate from 'mockdate'
import React from 'react'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { storage } from 'libs/storage'
import { render, fireEvent, flushAllPromisesWithAct, waitFor } from 'tests/utils'

const COOKIES_CONSENT_KEY = 'cookies_consent'
const hideModal = jest.fn()
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const deviceId = 'testUuidV4'

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), push: jest.fn() }),
  useFocusEffect: jest.fn(),
}))

describe('<CookiesConsent/>', () => {
  beforeEach(() => storage.clear(COOKIES_CONSENT_KEY))

  it('should render correctly', async () => {
    const renderAPI = render(<CookiesConsent visible={true} hideModal={hideModal} />)
    expect(renderAPI).toMatchSnapshot()
  })

  describe('accept all cookies', () => {
    it('should save cookies consent information in storage when accepted all cookies', async () => {
      const { getByText } = render(<CookiesConsent visible={true} hideModal={hideModal} />)
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)

      await flushAllPromisesWithAct()

      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual({
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: ALL_OPTIONAL_COOKIES,
          refused: [],
        },
      })
    })

    it('should hide modale when accepted all cookies', async () => {
      const { getByText } = render(<CookiesConsent visible={true} hideModal={hideModal} />)
      const acceptAllButton = getByText('Tout accepter')

      fireEvent.press(acceptAllButton)

      expect(hideModal).toBeCalled()
    })
  })

  describe('refuse all cookies', () => {
    it('should save cookies consent information in storage when user refused all cookies', async () => {
      const { getByText } = render(<CookiesConsent visible={true} hideModal={hideModal} />)
      const acceptAllButton = getByText('Tout refuser')

      fireEvent.press(acceptAllButton)

      await flushAllPromisesWithAct()

      expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual({
        deviceId,
        choiceDatetime: Today.toISOString(),
        consent: {
          mandatory: COOKIES_BY_CATEGORY.essential,
          accepted: [],
          refused: ALL_OPTIONAL_COOKIES,
        },
      })
    })

    it('should hide modale when user refused all cookies', async () => {
      const { getByText } = render(<CookiesConsent visible={true} hideModal={hideModal} />)
      const acceptAllButton = getByText('Tout refuser')

      fireEvent.press(acceptAllButton)

      expect(hideModal).toBeCalled()
    })
  })

  describe('make detailled cookie choice', () => {
    it('should save cookies consent information in storage when user partially accepts cookies', async () => {
      const { getByText, getByTestId } = render(
        <CookiesConsent visible={true} hideModal={hideModal} />
      )

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const performanceSwitch = getByTestId('Interrupteur-performance')
      fireEvent.press(performanceSwitch)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)

      await waitFor(async () =>
        expect(await storage.readObject(COOKIES_CONSENT_KEY)).toEqual({
          deviceId,
          choiceDatetime: Today.toISOString(),
          consent: {
            mandatory: COOKIES_BY_CATEGORY.essential,
            accepted: COOKIES_BY_CATEGORY.performance,
            refused: [...COOKIES_BY_CATEGORY.customization, ...COOKIES_BY_CATEGORY.marketing],
          },
        })
      )
    })

    it('should hide modale when user saves cookies choice', async () => {
      const { getByText } = render(<CookiesConsent visible={true} hideModal={hideModal} />)

      const chooseCookies = getByText('Choisir les cookies')
      fireEvent.press(chooseCookies)

      const saveChoice = getByText('Enregistrer mes choix')
      fireEvent.press(saveChoice)

      expect(hideModal).toBeCalled()
    })
  })
})
