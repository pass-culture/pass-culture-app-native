import AppScreen from '../../screenobjects/AppScreen'
import { find, findAll } from '../../helpers/utils/selector'

class SetCity extends AppScreen {
  constructor() {
    super('SetCity', true)
  }

  get postalCodeInput() {
    return find('Entrée pour la ville')
  }

  get cityOption() {
    return find('Proposition de ville 1\u00a0: Paris')
  }

  get submitButton() {
    return findAll('Continuer vers l’étape suivante')[1]
  }
}

export default new SetCity()
