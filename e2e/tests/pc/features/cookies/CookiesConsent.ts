import AppScreen from '../../screenobjects/AppScreen'
import { getRandomInt } from '../../helpers/utils/number'
import { $$$ } from '../../helpers/utils/selector'

class CookiesConsent extends AppScreen {
  constructor() {
    super('Tout accepter', true)
  }

  get accept() {
    return $$$('Tout accepter')
  }

  get refuse() {
    return $$$('Tout refuser')
  }

  get choose() {
    return $$$('Choisir les cookies')
  }

  async randomChoice() {
    await this.waitForIsShown(true)
    const dice = getRandomInt(0, 1)
    if (dice === 0) {
      await this.accept.click()
    } else if (dice === 1) {
      await this.refuse.click()
      // TODO: do 3rd choice to choose cookies
      // } else if (dice === 2) {
      //   await this.choose.click()
    }
    await this.waitForIsShown(false)
  }
}

export default new CookiesConsent()
