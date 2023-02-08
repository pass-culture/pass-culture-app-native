import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'
import { getRandomInt } from '../../helpers/utils/number'

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

  async randomChoiceAge() {
    await this.waitForIsShown(true)
    const dice = getRandomInt(0, 3)
    if (dice === 0) {
      await this.fifteenYO.click()
    } else if (dice === 1) {
      await this.sixteenYO.click()
    } else if (dice === 2) {
      await this.seventeenYO.click()
    } else if (dice === 3) {
      await this.eighteenYO.click()
    }
    await this.waitForIsShown(false)
  }
}

export default new AgeSelection()
