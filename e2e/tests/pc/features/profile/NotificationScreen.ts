import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class NotificationScreen extends AppScreen {
  constructor() {
    super('Interrupteur Autoriser l’envoi d’e-mails', true)
  }

  get authorizeEmailToggle() {
    return find('Interrupteur Autoriser l’envoi d’e-mails')
  }

  get marketingToggle() {
    return find('Interrupteur Autoriser les notifications marketing')
  }

  get goBackButton() {
    return find('Revenir en arrière')
  }
}

export default new NotificationScreen()
