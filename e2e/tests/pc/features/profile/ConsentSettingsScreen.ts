import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'
import { flags } from '../../helpers/utils/platform'

class ConsentSettingsScreen extends AppScreen {
  constructor() {
    super('ConsentSettings', true)
  }

  get acceptEverythingToggle() {
    return find('Interrupteur Tout accepter')
  }

  get personalizeYourNavigationToggle() {
    return find('Interrupteur Personnaliser ta navigation')
  }

  get saveNavigationStatsToggle() {
    return find('Interrupteur Enregistrer des statistiques de navigation')
  }

  get measureProductsEffectivenessToggle() {
    return find('Interrupteur Mesurer l’efficacité de nos publicités')
  }

  get saveChoicesButton() {
    return find('Enregistrer mes choix')
  }
}

export default new ConsentSettingsScreen()
