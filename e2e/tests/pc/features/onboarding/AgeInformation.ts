import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'

class AgeInformation extends AppScreen {
  constructor() {
    super('Plus tard', true)
  }

  get signup() {
    return $$$('Créer un compte')
  }

  get later() {
    return $$$('Plus tard')
  }

  async proceed() {
    await this.waitForIsShown(true)
    await this.later.click()
    await this.waitForIsShown(false)
  }
}

export default new AgeInformation()
