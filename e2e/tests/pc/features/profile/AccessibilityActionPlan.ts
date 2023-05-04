import AppScreen from '../../screenobjects/AppScreen'
import { findElementInPage } from '../../helpers/utils/selector'

class AccessibilityActionPlan extends AppScreen {
  constructor() {
    super('AccessibilityActionPlan', true)
  }

  get goBack() {
    return findElementInPage('Revenir en arrière', 'AccessibilityActionPlan')
  }
}

export default new AccessibilityActionPlan()
