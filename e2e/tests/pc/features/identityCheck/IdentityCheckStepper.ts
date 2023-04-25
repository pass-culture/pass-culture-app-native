import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class IdentityCheckStepper extends AppScreen {
  constructor() {
    super('IdentityCheckStepper', true)
  }

  get profileButton() {
    return find('Profil non complété')
  }
}

export default new IdentityCheckStepper()
