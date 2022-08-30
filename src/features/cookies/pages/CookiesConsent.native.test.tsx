import mockdate from 'mockdate'
import React from 'react'

import { ALL_OPTIONAL_COOKIES, COOKIES_BY_CATEGORY } from 'features/cookies/CookiesPolicy'
import { CookiesConsent } from 'features/cookies/pages/CookiesConsent'
import { COOKIES_CONSENT_KEY } from 'features/cookies/useCookies'
import { storage } from 'libs/storage'
import { render, fireEvent } from 'tests/utils'

const hideModal = jest.fn()
const Today = new Date(2022, 9, 29)
mockdate.set(Today)
const deviceId = 'testUuidV4'

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
})
