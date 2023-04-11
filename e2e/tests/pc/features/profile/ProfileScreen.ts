import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'

class ProfileScreen extends AppScreen {
  constructor() {
    super('Créer un compte', true)
  }

  get createAccount() {
    return $$$('Créer un compte')
  }
}

export default new ProfileScreen()
