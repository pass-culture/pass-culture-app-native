import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class AgeInformation extends AppScreen {
  constructor() {
    super('Plus tard', true)
  }

  get signup() {
    return find('Créer un compte')
  }

  get later() {
    return find('Plus tard')
  }

  async proceed() {
    await this.waitForIsShown()
    await this.later.click()
    await this.waitForIsHidden()
  }
}

export default new AgeInformation()
