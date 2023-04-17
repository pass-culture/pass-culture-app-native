import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class OnboardingGeolocation extends AppScreen {
  constructor() {
    super('Aller à l’écran suivant', true)
  }

  get skip() {
    return find('Aller à l’écran suivant')
  }

  get useGeolocation() {
    return find('Utiliser ma position')
  }

  async proceed() {
    await this.waitForIsShown()
    await this.skip.click()
    await this.waitForIsHidden()
  }
}

export default new OnboardingGeolocation()
