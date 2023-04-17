import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class FirstTutorial extends AppScreen {
  constructor() {
    super('Tout passer', true)
  }

  get continue() {
    return find('Continuer')
  }

  get skipAll() {
    return find('Tout passer')
  }

  get usePosition() {
    return find('Utiliser ma position')
  }

  get discover() {
    return find('Découvrir')
  }

  async proceed() {
    await this.waitForIsShown()
    await this.skipAll.click()
    await this.waitForIsHidden()
  }
}

export default new FirstTutorial()
