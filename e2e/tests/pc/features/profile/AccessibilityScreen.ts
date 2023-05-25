import { find } from '../../helpers/utils/selector'
import AppScreen from '../../screenobjects/AppScreen'

class AccessibilityScreen extends AppScreen {
  constructor() {
    super('Accessibility', true)
  }

  get accessibilityEngagementLink() {
    return find('Les engagements du pass Culture')
  }

  get recommendedPathsLink() {
    return find('Parcours recommandés')
  }

  get accessibilityDeclarationLink() {
    return find('Déclaration d’accessibilité')
  }

  get actionPlanLink() {
    return find('Schéma pluriannuel')
  }

  get goBack() {
    return find('Revenir en arrière')
  }
}

export default new AccessibilityScreen()
