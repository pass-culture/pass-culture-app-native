import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class AgeSelection extends AppScreen {
  constructor() {
    super('j’ai 15 ans', true)
  }

  get fifteenYO() {
    return find('j’ai 15 ans')
  }

  get sixteenYO() {
    return find('j’ai 16 ans')
  }

  get seventeenYO() {
    return find('j’ai 17 ans')
  }

  get eighteenYO() {
    return find('j’ai 18 ans')
  }

  get nonEligible() {
    return find('Autre')
  }

  async chooseAge() {
    await this.waitForIsShown()
    await this.eighteenYO.click()
    await this.waitForIsHidden()
  }
}

export default new AgeSelection()
