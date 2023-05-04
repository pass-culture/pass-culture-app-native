import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'
import { flags } from '../../helpers/utils/platform'

class ConsentSettingsScreen extends AppScreen {
  constructor() {
    super('ConsentSettings', true)
  }

  get acceptEverythingToggle() {
    return find('Interrupteur')
  }

  get personalizeYourNavigationToggle() {
    return find('Interrupteur-customization')
  }

  get saveNavigationStatsToggle() {
    return find('Interrupteur-performance')
  }

  get measureProductsEffectivenessToggle() {
    return find('Interrupteur-marketing')
  }

  get saveChoicesButton() {
    return find('Enregistrer mes choix')
  }
}

export default new ConsentSettingsScreen()
