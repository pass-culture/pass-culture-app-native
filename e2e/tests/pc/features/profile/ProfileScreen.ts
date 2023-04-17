import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class ProfileScreen extends AppScreen {
  constructor() {
    super('Créer un compte', true)
  }

  get createAccount() {
    return find('Créer un compte')
  }
}

export default new ProfileScreen()
