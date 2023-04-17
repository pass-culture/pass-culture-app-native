import AppScreen from '../../screenobjects/AppScreen'
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

  async acceptCookies() {
    await this.waitForIsShown()
    await this.accept.click()
    await this.waitForIsHidden()
  }
}

export default new CookiesConsent()
