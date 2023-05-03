import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'
import { flags } from '../../helpers/utils/platform'

class ProfileScreen extends AppScreen {
  constructor() {
    super('Créer un compte', true)
  }

  get createAccount() {
    return find('Créer un compte')
  }

  get notificationsLink() {
    return find('Notifications')
  }

  get accessibilityLink() {
    return find('Accessibilité')
  }

  get legalInformationLink() {
    return find('Informations légales')
  }

  get privacyLink() {
    return find('Confidentialité')
  }
}

export default new ProfileScreen()
