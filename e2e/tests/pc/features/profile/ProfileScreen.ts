import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'

class ProfileScreen extends AppScreen {
  constructor() {
    super('Profile', true)
  }

  get createAccount() {
    return $$$('Créer un compte')
  }
}

export default new ProfileScreen()
