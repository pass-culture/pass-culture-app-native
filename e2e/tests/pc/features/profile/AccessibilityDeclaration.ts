import AppScreen from '../../screenobjects/AppScreen'
import { findElementInPage } from '../../helpers/utils/selector'

class AccessibilityDeclaration extends AppScreen {
  constructor() {
    super('AccessibilityDeclaration', true)
  }

  get goBack() {
    return findElementInPage('Revenir en arrière', 'AccessibilityDeclaration')
  }
}

export default new AccessibilityDeclaration()
