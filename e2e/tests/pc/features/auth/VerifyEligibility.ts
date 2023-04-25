import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class VerifyEligibility extends AppScreen {
  constructor() {
    super('VerifyEligibility', true)
  }

  get start() {
    return find('Commencer la vérification')
  }
}

export default new VerifyEligibility()
