import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookiesConsentStore } from 'features/cookies/store/cookiesConsentStore'
import { spectacleVivantAdjustEventsStoreActions } from 'features/home/pages/helpers/spectacleVivantAdjustEventsStore'
import {
  logSpectacleVivantAdjustEvents,
  useSpectacleVivantAdjustEvents,
} from 'features/home/pages/helpers/useSpectacleVivantAdjustEvents'
import { Adjust } from 'libs/adjust/adjust'
import { env } from 'libs/environment/env'
import { AdjustEvents } from 'shared/adjust/adjustEvents'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/adjust/adjust')
const AdjustMock = Adjust as jest.Mocked<typeof Adjust>

const TESTING_SPECTACLE_VIVANT_HOME_ID = '3S4UGnN2tfPIV1ANpdUYs6'
const PRODUCTION_SPECTACLE_VIVANT_HOME_ID = '3g0blWv0UfxJC2XQ2KSkcG'
const OTHER_HOME_ID = 'otherHomeId'

const mockAdjustEnabled = (isEnabled: boolean) =>
  AdjustMock.isEnabled.mockImplementation((callback) => callback(isEnabled))

const setUnknownCookiesChoice = () =>
  useCookiesConsentStore.getState().setCookiesConsentState({ state: ConsentState.UNKNOWN })

const setAcceptedCookies = (accepted: CookieNameEnum[]) =>
  useCookiesConsentStore.getState().setCookiesConsentState({
    state: ConsentState.HAS_CONSENT,
    value: { mandatory: [], accepted, refused: [] },
  })

describe('logSpectacleVivantAdjustEvents', () => {
  beforeEach(() => {
    env.CONTENTFUL_ENVIRONMENT = 'testing'
    spectacleVivantAdjustEventsStoreActions.resetForTests()
    mockAdjustEnabled(true)
  })

  it('should log spectacleVivant when the spectacle vivant home is displayed', () => {
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.SPECTACLE_VIVANT)
    expect(AdjustMock.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_SPECTACLE_VIVANT)
  })

  it('should log spectacleVivant for the spectacle vivant home of the production Contentful environment', () => {
    env.CONTENTFUL_ENVIRONMENT = 'master'

    logSpectacleVivantAdjustEvents(PRODUCTION_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.SPECTACLE_VIVANT)
  })

  it('should not log any event for another home', () => {
    spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(true)

    logSpectacleVivantAdjustEvents(OTHER_HOME_ID)

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()
  })

  it('should log spectacleVivant only once per session', () => {
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenCalledTimes(1)
  })

  it('should log spectacleVivant and new_spectacleVivant during the first session after install', () => {
    spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(true)

    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenNthCalledWith(1, AdjustEvents.SPECTACLE_VIVANT)
    expect(AdjustMock.logEvent).toHaveBeenNthCalledWith(2, AdjustEvents.NEW_SPECTACLE_VIVANT)
  })

  it('should log new_spectacleVivant only once per session', () => {
    spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(true)

    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenCalledTimes(2)
  })

  it('should not log any event when Adjust is disabled', () => {
    spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(true)
    mockAdjustEnabled(false)

    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()
  })

  it('should log the events when Adjust is enabled later in the session', () => {
    spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(true)
    mockAdjustEnabled(false)
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    mockAdjustEnabled(true)
    logSpectacleVivantAdjustEvents(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenNthCalledWith(1, AdjustEvents.SPECTACLE_VIVANT)
    expect(AdjustMock.logEvent).toHaveBeenNthCalledWith(2, AdjustEvents.NEW_SPECTACLE_VIVANT)
  })
})

describe('useSpectacleVivantAdjustEvents', () => {
  beforeEach(() => {
    env.CONTENTFUL_ENVIRONMENT = 'testing'
    spectacleVivantAdjustEventsStoreActions.resetForTests()
    mockAdjustEnabled(true)
  })

  it('should log spectacleVivant once the spectacle vivant home is loaded', () => {
    setAcceptedCookies([CookieNameEnum.ADJUST])
    const { rerender } = renderHook(useSpectacleVivantAdjustEvents, { initialProps: '' })

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()

    rerender(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.SPECTACLE_VIVANT)
  })

  it('should not log any event while the cookies choice is unknown', () => {
    setUnknownCookiesChoice()

    renderHook(useSpectacleVivantAdjustEvents, { initialProps: TESTING_SPECTACLE_VIVANT_HOME_ID })

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()
  })

  it('should log the events when the Adjust cookies are accepted while the spectacle vivant home is displayed', () => {
    spectacleVivantAdjustEventsStoreActions.setIsFirstSessionAfterInstall(true)
    // the Adjust SDK is only initialized once the cookies are accepted
    mockAdjustEnabled(false)
    setUnknownCookiesChoice()
    renderHook(useSpectacleVivantAdjustEvents, { initialProps: TESTING_SPECTACLE_VIVANT_HOME_ID })

    act(() => {
      mockAdjustEnabled(true)
      setAcceptedCookies([CookieNameEnum.ADJUST])
    })

    expect(AdjustMock.logEvent).toHaveBeenNthCalledWith(1, AdjustEvents.SPECTACLE_VIVANT)
    expect(AdjustMock.logEvent).toHaveBeenNthCalledWith(2, AdjustEvents.NEW_SPECTACLE_VIVANT)
  })

  it('should not log any event when other cookies than Adjust are accepted', () => {
    setUnknownCookiesChoice()
    renderHook(useSpectacleVivantAdjustEvents, { initialProps: TESTING_SPECTACLE_VIVANT_HOME_ID })

    act(() => setAcceptedCookies([CookieNameEnum.GOOGLE_ANALYTICS]))

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()
  })

  it('should log spectacleVivant only once when the Adjust cookies are refused then accepted again', () => {
    setAcceptedCookies([CookieNameEnum.ADJUST])
    renderHook(useSpectacleVivantAdjustEvents, { initialProps: TESTING_SPECTACLE_VIVANT_HOME_ID })

    act(() => setAcceptedCookies([]))
    act(() => setAcceptedCookies([CookieNameEnum.ADJUST]))

    expect(AdjustMock.logEvent).toHaveBeenCalledTimes(1)
  })
})
