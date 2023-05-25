import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'
import { flags } from '../../helpers/utils/platform'

class LegalNoticesScreen extends AppScreen {
  constructor() {
    super('LegalNotices', true)
  }

  get goBack() {
    return find('Revenir en arrière')
  }
}

export default new LegalNoticesScreen()
