import { Linking } from 'react-native'

import { Adjust as AdjustMock } from '__mocks__/react-native-adjust'
import { env } from 'libs/environment/env'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { act, renderHook } from 'tests/utils'

import { useAdjustDeeplinkAttribution } from './useAdjustDeeplinkAttribution'

const ADJUST_LINK =
  'https://passculture.go.link/accueil-thematique?homeId=fakeEntryId&from=deeplink'
const CUSTOM_SCHEME_LINK = `${env.URL_PREFIX}://accueil-thematique?homeId=fakeEntryId&from=deeplink`
const WEBAPP_LINK = `${WEBAPP_V2_URL}/mot-de-passe-perdu?token=fakeToken&email=jean.dupont@example.com`

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

  it.each([ADJUST_LINK, CUSTOM_SCHEME_LINK])(
    'should send the link that opened the app to Adjust: %s',
    async (url) => {
      mockGetInitialURL.mockResolvedValueOnce(url)

      renderHook(useAdjustDeeplinkAttribution)
      await act(async () => {})

      expect(AdjustMock.processDeeplink).toHaveBeenCalledWith({ deeplink: url })
    }
  )

  it.each([ADJUST_LINK, CUSTOM_SCHEME_LINK])(
    'should send the link received while the app is running to Adjust: %s',
    async (url) => {
      renderHook(useAdjustDeeplinkAttribution)
      await act(async () => {})

      receiveUrl(url)

      expect(AdjustMock.processDeeplink).toHaveBeenCalledWith({ deeplink: url })
    }
  )

  it('should not send a webapp link that opened the app to Adjust', async () => {
    mockGetInitialURL.mockResolvedValueOnce(WEBAPP_LINK)

    renderHook(useAdjustDeeplinkAttribution)
    await act(async () => {})

    expect(AdjustMock.processDeeplink).not.toHaveBeenCalled()
  })

  it('should not send a webapp link received while the app is running to Adjust', async () => {
    renderHook(useAdjustDeeplinkAttribution)
    await act(async () => {})

    receiveUrl(WEBAPP_LINK)

    expect(AdjustMock.processDeeplink).not.toHaveBeenCalled()
  })
})
