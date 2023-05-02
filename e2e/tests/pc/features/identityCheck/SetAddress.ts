import AppScreen from '../../screenobjects/AppScreen'
import { find, findAll } from '../../helpers/utils/selector'

class SetAddress extends AppScreen {
  constructor() {
    super('SetAddress', true)
  }

  get addressInput() {
    return find('Entrée pour l’adresse')
  }

  get submitButton() {
    return findAll('Continuer vers l’étape suivante')[2]
  }
}

export default new SetAddress()
