import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class Stepper extends AppScreen {
  constructor() {
    super('Stepper', true)
  }

  get profileButton() {
    return find('Profil non complété')
  }
}

export default new Stepper()
