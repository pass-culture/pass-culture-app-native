import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'

class OnboardingWelcome extends AppScreen {
  constructor() {
    super('C’est parti\u00a0!', true)
  }

  get start() {
    return $$$('C’est parti\u00a0!')
  }

  get login() {
    return $$$('Se connecter')
  }

  async proceed() {
    await this.waitForIsShown(true)
    await this.start.click()
    await this.waitForIsShown(false)
  }
}

export default new OnboardingWelcome()
