import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class CookiesConsent extends AppScreen {
  constructor() {
    super('Tout accepter', true)
  }

  get accept() {
    return find('Tout accepter')
  }

  get refuse() {
    return find('Tout refuser')
  }

  get choose() {
    return find('Choisir les cookies')
  }

  async acceptCookies() {
    await this.waitForIsShown()
    await this.accept.click()
    await this.waitForIsHidden()
  }
}

export default new CookiesConsent()
