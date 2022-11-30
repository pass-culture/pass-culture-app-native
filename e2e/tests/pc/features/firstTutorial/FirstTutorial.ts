import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'

class FirstTutorial extends AppScreen {
  constructor() {
    super('Tout passer', true)
  }

  get continue() {
    return $$$('Continuer')
  }

  get skipAll() {
    return $$$('Tout passer')
  }

  get usePosition() {
    return $$$('Utiliser ma position')
  }

  get discover() {
    return $$$('Découvrir')
  }

  async proceed() {
    await this.waitForIsShown(true)
    await this.skipAll.click()
    await this.waitForIsShown(false)
  }
}

export default new FirstTutorial()
