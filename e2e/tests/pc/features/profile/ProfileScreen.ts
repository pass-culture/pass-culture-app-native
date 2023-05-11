import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class ProfileScreen extends AppScreen {
  constructor() {
    super('Profile', true)
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

  get legalNoticesLink() {
    return find('Informations légales')
  }

  get consentLink() {
    return find('Confidentialité')
  }

  get snackbarConsentSettings() {
    return find('Supprimer le message\u00a0: Ton choix a bien été enregistré.')
  }
}

export default new ProfileScreen()
