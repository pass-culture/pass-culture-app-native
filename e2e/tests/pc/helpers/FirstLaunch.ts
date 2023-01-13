import { flags } from './utils/platform'
import CookiesConsent from '../features/cookies/CookiesConsent'
import NativeAlert from './NativeAlert'
import { TabBar } from '../features/navigation/TabBar'
import AgeSelection from '../features/onboarding/AgeSelection'
import AgeInformation from '../features/onboarding/AgeInformation'
import OnboardingWelcome from '../features/onboarding/OnboardingWelcome'
import OnboardingGeolocation from '../features/onboarding/OnboardingGeolocation'
import Browser from './Browser'

class FirstLaunch {
  retries = 2
  nativeModalPassed = 0

  async init(tabBar: TabBar) {
    if (flags.isWeb) {
      await Browser.url('/')
    }
    if (!flags.isWeb && flags.isIOS) {
      // This while loop will take care of the DoNotTrack and Notification Alert
      // They may or may not be displayed, so we try max twice.
      while (this.retries-- && this.nativeModalPassed !== 2) {
        try {
          await NativeAlert.waitForIsShown(true)
          await NativeAlert.topOnButtonWithText('Allow')
          await NativeAlert.waitForIsShown(false)
          this.nativeModalPassed += 1
        } catch (err) {
          // ignore err
        }
      }
    }
    await CookiesConsent.randomChoice()
    if (!flags.isWeb) {
      await OnboardingWelcome.proceed()
      await OnboardingGeolocation.proceed()
      await AgeSelection.randomChoiceAge()
      await AgeInformation.proceed()
    }
    await tabBar.waitForIsShown(true)
    return true
  }
}

export default new FirstLaunch()
