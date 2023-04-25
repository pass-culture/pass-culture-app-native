import AppScreen from '../../screenobjects/AppScreen'
import { find, findAll } from '../../helpers/utils/selector'

class SetStatus extends AppScreen {
  constructor() {
    super('IdentityCheckStatus', true)
  }

  get statusOption() {
    return find('Lycéen')
  }

  get submitButton() {
    return findAll('Continuer vers l’étape suivante')[3]
  }
}

export default new SetStatus()
