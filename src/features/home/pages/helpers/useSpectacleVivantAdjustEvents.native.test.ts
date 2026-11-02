import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookiesConsentStore } from 'features/cookies/store/cookiesConsentStore'
import { useSpectacleVivantAdjustEvents } from 'features/home/pages/helpers/useSpectacleVivantAdjustEvents'
import { Adjust } from 'libs/adjust/adjust'
import { env } from 'libs/environment/env'
import { AdjustEvents } from 'shared/adjust/adjustEvents'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/adjust/adjust')
const AdjustMock = Adjust as jest.Mocked<typeof Adjust>

const TESTING_SPECTACLE_VIVANT_HOME_ID = '3S4UGnN2tfPIV1ANpdUYs6'
const PRODUCTION_SPECTACLE_VIVANT_HOME_ID = '3g0blWv0UfxJC2XQ2KSkcG'
const OTHER_HOME_ID = 'otherHomeId'

const setUnknownCookiesChoice = () =>
  useCookiesConsentStore.getState().setCookiesConsentState({ state: ConsentState.UNKNOWN })

const setAcceptedCookies = (accepted: CookieNameEnum[]) =>
  useCookiesConsentStore.getState().setCookiesConsentState({
    state: ConsentState.HAS_CONSENT,
    value: { mandatory: [], accepted, refused: [] },
  })

describe('useSpectacleVivantAdjustEvents', () => {
  beforeEach(() => {
    env.CONTENTFUL_ENVIRONMENT = 'testing'
  })

  it('should log spectacleVivant once the spectacle vivant home is loaded', () => {
    setAcceptedCookies([CookieNameEnum.ADJUST])
    const { rerender } = renderHook(useSpectacleVivantAdjustEvents, { initialProps: '' })

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()

    rerender(TESTING_SPECTACLE_VIVANT_HOME_ID)

    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.SPECTACLE_VIVANT)
  })

  it('should log spectacleVivant for the spectacle vivant home of the production Contentful environment', () => {
    env.CONTENTFUL_ENVIRONMENT = 'master'
    setAcceptedCookies([CookieNameEnum.ADJUST])

    renderHook(useSpectacleVivantAdjustEvents, {
      initialProps: PRODUCTION_SPECTACLE_VIVANT_HOME_ID,
    })

    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.SPECTACLE_VIVANT)
  })

  it('should not log spectacleVivant for another home', () => {
    setAcceptedCookies([CookieNameEnum.ADJUST])

    renderHook(useSpectacleVivantAdjustEvents, { initialProps: OTHER_HOME_ID })

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()
  })

  it('should not log spectacleVivant while the cookies choice is unknown', () => {
    setUnknownCookiesChoice()

    renderHook(useSpectacleVivantAdjustEvents, { initialProps: TESTING_SPECTACLE_VIVANT_HOME_ID })

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()
  })

  it('should not log spectacleVivant when other cookies than Adjust are accepted', () => {
    setAcceptedCookies([CookieNameEnum.GOOGLE_ANALYTICS])

    renderHook(useSpectacleVivantAdjustEvents, { initialProps: TESTING_SPECTACLE_VIVANT_HOME_ID })

    expect(AdjustMock.logEvent).not.toHaveBeenCalled()
  })

  it('should log spectacleVivant when the Adjust cookies are accepted while the spectacle vivant home is displayed', () => {
    // first launch through a campaign link: the cookies consent modal is displayed over the home
    setUnknownCookiesChoice()
    renderHook(useSpectacleVivantAdjustEvents, { initialProps: TESTING_SPECTACLE_VIVANT_HOME_ID })

    act(() => setAcceptedCookies([CookieNameEnum.ADJUST]))

    expect(AdjustMock.logEvent).toHaveBeenCalledTimes(1)
    expect(AdjustMock.logEvent).toHaveBeenCalledWith(AdjustEvents.SPECTACLE_VIVANT)
  })
})
