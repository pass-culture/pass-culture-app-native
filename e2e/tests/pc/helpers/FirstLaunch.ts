import { flags } from './utils/platform'
import CookiesConsent from '../features/cookies/CookiesConsent'
import FirstTutorial from '../features/firstTutorial/FirstTutorial'
import OnboardingAuthentication from '../features/onboarding/OnboardingAuthentication'
import NativeAlert from './NativeAlert'
import TabBar from '../features/navigation/TabBar'

class FirstLaunch {
  retries = 2
  nativeModalPassed = 0

  async init() {
    if (flags.isWeb) {
      await browser.url('/')
    }
    if (!flags.isWeb && flags.isIOS) {
      // This while loop will take care of the DoNotTrack and Notification Alert
      // kopax-polyconseil have random order and random language, despite forcing the iOS device to french language within the system
      // They may or may not be displayed, so we try to pass both twice.
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
    await FirstTutorial.proceed()
    if (!flags.isWeb) {
      await OnboardingAuthentication.proceed()
    }
    await TabBar.waitForIsShown(true)
    return true
  }
}

export default new FirstLaunch()
