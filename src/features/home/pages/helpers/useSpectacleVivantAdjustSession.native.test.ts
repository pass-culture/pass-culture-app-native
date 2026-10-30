import { AppState } from 'react-native'

import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookiesConsentStore } from 'features/cookies/store/cookiesConsentStore'
import { spectacleVivantAdjustEventsStoreActions } from 'features/home/pages/helpers/spectacleVivantAdjustEventsStore'
import { logSpectacleVivantAdjustEvents } from 'features/home/pages/helpers/useSpectacleVivantAdjustEvents'
import { useSpectacleVivantAdjustSession } from 'features/home/pages/helpers/useSpectacleVivantAdjustSession'
import { Adjust } from 'libs/adjust/adjust'
import { env } from 'libs/environment/env'
import { AdjustEvents } from 'shared/adjust/adjustEvents'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/adjust/adjust')
const AdjustMock = Adjust as jest.Mocked<typeof Adjust>

const TESTING_SPECTACLE_VIVANT_HOME_ID = '3S4UGnN2tfPIV1ANpdUYs6'
const ONE_MINUTE_IN_MS = 60 * 1000

jest.useFakeTimers().setSystemTime(new Date('2026-11-06T10:00:00Z'))

const setAcceptedCookies = (accepted: CookieNameEnum[]) =>
  useCookiesConsentStore.getState().setCookiesConsentState({
    state: ConsentState.HAS_CONSENT,
    value: { mandatory: [], accepted, refused: [] },
  })

const spendTimeInBackground = (minutes: number) =>
  act(() => {
    AppState.__triggerChange('background')
    jest.advanceTimersByTime(minutes * ONE_MINUTE_IN_MS)
    AppState.__triggerChange('active')
  })

describe('useSpectacleVivantAdjustSession', () => {
  beforeEach(() => {
    env.CONTENTFUL_ENVIRONMENT = 'testing'
    spectacleVivantAdjustEventsStoreActions.resetForTests()
    AdjustMock.isEnabled.mockImplementation((callback) => callback(true))
    AppState.__triggerChange('active')
    setAcceptedCookies([CookieNameEnum.ADJUST])
    // first arrival on the spectacle vivant home, during the first session after install
    spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(true)
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)
    AdjustMock.logEvent.mockClear()
  })

  it('should log spectacleVivant again after more than 30 minutes in background, like a new Adjust session', () => {
    renderHook(useSpectacleVivantAdjustSession)

    spendTimeInBackground(31)
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.SPECTACLE_VIVANT)
  })

  it('should not log new_spectacleVivant again after more than 30 minutes in background, the first session being over', () => {
    renderHook(useSpectacleVivantAdjustSession)

    spendTimeInBackground(31)
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_SPECTACLE_VIVANT)
  })

  it('should not log any event again after exactly 30 minutes in background, Adjust keeping the session', () => {
    renderHook(useSpectacleVivantAdjustSession)

    spendTimeInBackground(30)
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()
  })

  it('should count the time in background from the moment the app becomes inactive', () => {
    renderHook(useSpectacleVivantAdjustSession)

    act(() => {
      // iOS goes through inactive before background
      AppState.__triggerChange('inactive')
      jest.advanceTimersByTime(20 * ONE_MINUTE_IN_MS)
      AppState.__triggerChange('background')
      jest.advanceTimersByTime(11 * ONE_MINUTE_IN_MS)
      AppState.__triggerChange('active')
    })
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.SPECTACLE_VIVANT)
  })

  it('should log new_spectacleVivant when the Adjust cookies are accepted after more than 30 minutes in background, the Adjust session starting with the consent', () => {
    spectacleVivantAdjustEventsStoreActions.resetForTests()
    spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(true)
    // first launch through a campaign link: the cookies consent modal is displayed over the home
    useCookiesConsentStore.getState().setCookiesConsentState({ state: ConsentState.UNKNOWN })
    renderHook(useSpectacleVivantAdjustSession)

    spendTimeInBackground(31)
    setAcceptedCookies([CookieNameEnum.ADJUST])
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_SPECTACLE_VIVANT)
  })

  it('should keep the first session when only other cookies than Adjust are accepted before going to background', () => {
    spectacleVivantAdjustEventsStoreActions.resetForTests()
    spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(true)
    setAcceptedCookies([CookieNameEnum.GOOGLE_ANALYTICS])
    renderHook(useSpectacleVivantAdjustSession)

    spendTimeInBackground(31)
    setAcceptedCookies([CookieNameEnum.GOOGLE_ANALYTICS, CookieNameEnum.ADJUST])
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_SPECTACLE_VIVANT)
  })
})
