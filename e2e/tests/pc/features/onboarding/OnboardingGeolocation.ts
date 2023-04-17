import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'

class OnboardingGeolocation extends AppScreen {
  constructor() {
    super('Aller à l’écran suivant', true)
  }

  get skip() {
    return $$$('Aller à l’écran suivant')
  }

  get useGeolocation() {
    return $$$('Utiliser ma position')
  }

  async proceed() {
    await this.waitForIsShown()
    await this.skip.click()
    await this.waitForIsHidden()
  }
}

export default new OnboardingGeolocation()
