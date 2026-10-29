import { Linking } from 'react-native'

import { Adjust as AdjustMock } from '__mocks__/react-native-adjust'
import { env } from 'libs/environment/env'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { act, renderHook } from 'tests/utils'

import { useAdjustDeeplinkAttribution } from './useAdjustDeeplinkAttribution'

// Adjust links carry the Adjust tracker (adj_t), like the full click URL of an Adjust deep link
const ADJUST_LINK = `https://${env.ADJUST_LINK_DOMAIN}/accueil-thematique?homeId=fakeEntryId&from=deeplink&adj_t=fakeTracker&adj_deep_link_id=123`
// Adjust adds its tracker when it opens the app with the custom scheme
const CUSTOM_SCHEME_LINK = `${env.URL_PREFIX}://accueil-thematique?homeId=fakeEntryId&from=deeplink&adj_t=fakeTracker&adj_deep_link_id=123`
const WEBAPP_LINK = `${WEBAPP_V2_URL}/mot-de-passe-perdu?token=fakeToken&email=jean.dupont@example.com`
const CUSTOM_SCHEME_LINK_WITH_LEGACY_ADJUST_TRACKER = `${env.URL_PREFIX}://accueil-thematique?homeId=fakeEntryId&from=deeplink&adjust_t=fakeTracker`
const ADJUST_LINK_WITHOUT_ADJUST_TRACKER = `https://${env.ADJUST_LINK_DOMAIN}/mot-de-passe-perdu?token=fakeToken&email=jean.dupont@example.com`
const CUSTOM_SCHEME_LINK_WITHOUT_ADJUST_TRACKER = `${env.URL_PREFIX}:///signup-confirmation?email=jean.dupont@example.com&token=fakeToken`

const mockGetInitialURL = jest.spyOn(Linking, 'getInitialURL')
const mockAddEventListener = jest.spyOn(Linking, 'addEventListener')

const receiveUrl = (url: string) => {
  const listener = mockAddEventListener.mock.calls[0]?.[1]
  listener?.({ url })
}

describe('useAdjustDeeplinkAttribution', () => {
  beforeEach(() => {
    mockGetInitialURL.mockResolvedValue(null)
  })

  it.each([ADJUST_LINK, CUSTOM_SCHEME_LINK, CUSTOM_SCHEME_LINK_WITH_LEGACY_ADJUST_TRACKER])(
    'should send the link that opened the app to Adjust: %s',
    async (url) => {
      mockGetInitialURL.mockResolvedValueOnce(url)

      renderHook(useAdjustDeeplinkAttribution)
      await act(async () => {})

      expect(AdjustMock.processDeeplink).toHaveBeenCalledWith({ deeplink: url })
    }
  )

  it.each([ADJUST_LINK, CUSTOM_SCHEME_LINK, CUSTOM_SCHEME_LINK_WITH_LEGACY_ADJUST_TRACKER])(
    'should send the link received while the app is running to Adjust: %s',
    async (url) => {
      renderHook(useAdjustDeeplinkAttribution)
      await act(async () => {})

      receiveUrl(url)

      expect(AdjustMock.processDeeplink).toHaveBeenCalledWith({ deeplink: url })
    }
  )

  it.each([
    WEBAPP_LINK,
    ADJUST_LINK_WITHOUT_ADJUST_TRACKER,
    CUSTOM_SCHEME_LINK_WITHOUT_ADJUST_TRACKER,
  ])('should not send a link that did not come from Adjust and opened the app: %s', async (url) => {
    mockGetInitialURL.mockResolvedValueOnce(url)

    renderHook(useAdjustDeeplinkAttribution)
    await act(async () => {})

    expect(AdjustMock.processDeeplink).not.toHaveBeenCalled()
  })

  it.each([
    WEBAPP_LINK,
    ADJUST_LINK_WITHOUT_ADJUST_TRACKER,
    CUSTOM_SCHEME_LINK_WITHOUT_ADJUST_TRACKER,
  ])(
    'should not send a link that did not come from Adjust and was received while the app is running: %s',
    async (url) => {
      renderHook(useAdjustDeeplinkAttribution)
      await act(async () => {})

      receiveUrl(url)

      expect(AdjustMock.processDeeplink).not.toHaveBeenCalled()
    }
  )
})
