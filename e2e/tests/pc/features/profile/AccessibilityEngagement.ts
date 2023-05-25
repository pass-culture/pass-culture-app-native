import AppScreen from '../../screenobjects/AppScreen'
import { findElementInPage } from '../../helpers/utils/selector'

class AccessibilityEngagement extends AppScreen {
  constructor() {
    super('AccessibilityEngagement', true)
  }

  get goBack() {
    return findElementInPage('Revenir en arrière', 'AccessibilityEngagement')
  }
}

export default new AccessibilityEngagement()
