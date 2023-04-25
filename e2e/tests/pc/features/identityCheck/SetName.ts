import AppScreen from '../../screenobjects/AppScreen'
import { find } from '../../helpers/utils/selector'

class SetName extends AppScreen {
  constructor() {
    super('SetName', true)
  }

  get firstNameInput() {
    return find('Entrée pour le prénom')
  }

  get lastNameInput() {
    return find('Entrée pour le nom')
  }

  get continueButton() {
    return find('Continuer vers l’étape suivante')
  }
}

export default new SetName()
