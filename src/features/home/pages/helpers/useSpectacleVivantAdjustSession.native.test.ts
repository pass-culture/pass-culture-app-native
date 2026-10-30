import { AppState } from 'react-native'

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
})
