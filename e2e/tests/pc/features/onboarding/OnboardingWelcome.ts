import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class OnboardingWelcome extends AppScreen {
  constructor() {
    super('C’est parti\u00a0!', true)
  }

  get start() {
    return find('C’est parti\u00a0!')
  }

  get login() {
    return find('Se connecter')
  }

  async proceed() {
    await this.waitForIsShown()
    await this.start.click()
    await this.waitForIsHidden()
  }
}

export default new OnboardingWelcome()
