import { flags } from './utils/platform'
import CookiesConsent from '../features/cookies/CookiesConsent'
import NativeAlert from './NativeAlert'
import { TabBar } from '../features/navigation/TabBar'
import AgeSelection from '../features/onboarding/AgeSelection'
import AgeInformation from '../features/onboarding/AgeInformation'
import OnboardingWelcome from '../features/onboarding/OnboardingWelcome'
import OnboardingGeolocation from '../features/onboarding/OnboardingGeolocation'
import Browser from './Browser'
import {timeout} from "./utils/time";

class FirstLaunch {
  async allowIOSAlert() {
    let retries = 2
    let nativeModalPassed = false
    // This while loop will take care of the DoNotTrack and Notification Alert
    // It may or may not be displayed, so we try max twice.
    while (retries && !nativeModalPassed) {
      try {
        retries--
        await NativeAlert.waitForIsShown(true)
        await NativeAlert.topOnButtonWithText('Allow')
        await NativeAlert.waitForIsShown(false)
        nativeModalPassed = true
      } catch (err) {
        // ignore err
      }
    }
  }

  async init(tabBar: TabBar) {
    if (flags.isWeb) {
      await Browser.url('/')
    }
    if (!flags.isWeb && flags.isIOS) {
      // Notification Alert
      await this.allowIOSAlert()
    }
    await timeout(flags.isWeb ? 8000 : 4000)
    await CookiesConsent.randomChoice()
    if (!flags.isWeb && flags.isIOS) {
      // ATT Alert
      await this.allowIOSAlert()
    }
    if (!flags.isWeb) {
      await OnboardingWelcome.proceed()
      await OnboardingGeolocation.proceed()
      await AgeSelection.randomChoiceAge()
      await AgeInformation.proceed()
    }
    await timeout(1000)
    await tabBar.waitForIsShown(true)
    return true
  }
}

export default new FirstLaunch()
