import AppScreen from '../../screenobjects/AppScreen'
import { find, findAll } from '../../helpers/utils/selector'

class SetSchoolType extends AppScreen {
  constructor() {
    super('SetSchoolType', true)
  }

  get schoolTypeOption() {
    return find('Lycée public')
  }

  get submitButton() {
    return findAll('Continuer vers l’étape suivante')[4]
  }
}

export default new SetSchoolType()
