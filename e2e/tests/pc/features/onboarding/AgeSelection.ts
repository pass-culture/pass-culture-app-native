import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'

class AgeSelection extends AppScreen {
  constructor() {
    super('j’ai 15 ans', true)
  }

  get fifteenYO() {
    return $$$('j’ai 15 ans')
  }

  get sixteenYO() {
    return $$$('j’ai 16 ans')
  }

  get seventeenYO() {
    return $$$('j’ai 17 ans')
  }

  get eighteenYO() {
    return $$$('j’ai 18 ans')
  }

  get nonEligible() {
    return $$$('Autre')
  }

  async chooseAge() {
    await this.waitForIsShown(true)
    await this.eighteenYO.click()
    await this.waitForIsShown(false)
  }
}

export default new AgeSelection()
