import AppScreen from '../../screenobjects/AppScreen'
import { findElementInPage } from '../../helpers/utils/selector'

class RecommendedPaths extends AppScreen {
  constructor() {
    super('RecommendedPaths', true)
  }

  get goBack() {
    return findElementInPage('Revenir en arrière', 'RecommendedPaths')
  }
}

export default new RecommendedPaths()
