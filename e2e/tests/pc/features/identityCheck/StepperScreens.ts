import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'

type IRegistrationScreens = {
  address: RegistrationAddress
  city: RegistrationCity
  firstname: RegistrationFirstName
  name: RegistrationName
  profile: CompleteProfile
  statut: CompleteStatus
  verifyId: VerifyId
}

class StepperScreens extends AppScreen {
  addressScreen: RegistrationAddress
  cityScreen: RegistrationCity
  completeProfileScreen: CompleteProfile
  completeStatutScreen: CompleteStatus
  firstnameScreen: RegistrationFirstName
  nameScreen: RegistrationName
  verifyIdScreen: VerifyId

  constructor(screens: IRegistrationScreens) {
    super('Stepper', true)
    this.addressScreen = screens.address
    this.cityScreen = screens.city
    this.completeProfileScreen = screens.profile
    this.completeStatutScreen = screens.statut
    this.firstnameScreen = screens.firstname
    this.nameScreen = screens.name
    this.verifyIdScreen = screens.verifyId
  }
}

class VerifyId extends AppScreen {
  constructor() {
    super('Commencer la vérification', true)
  }
  get idcheck() {
    return $$$('Commencer la vérification')
  }
}

class CompleteProfile extends AppScreen {
  constructor() {
    super('Profil Non complété', true)
  }
  get completeProfile() {
    return $$$('Profil Non complété')
  }
}

class RegistrationFirstName extends AppScreen {
  constructor() {
    super('Entrée pour le prénom', true)
  }
  get firstname() {
    return $$$('Entrée pour le prénom')
  }
}

class RegistrationName extends AppScreen {
  constructor() {
    super('Entrée pour le nom', true)
  }
  get name() {
    return $$$('Entrée pour le nom')
  }
  get submit() {
    return $$$('Continuer vers l’étape suivante')
  }
}

class RegistrationCity extends AppScreen {
  constructor() {
    super('searchInput', true)
  }
  get city() {
    return $$$('searchInput')
  }

  cityOption(city: string) {
    return $$$(`Proposition de ville 1\u00a0: ${city}`)
  }
  get submit() {
    return $$$('Continuer vers l’étape suivante')
  }
}
class RegistrationAddress extends AppScreen {
  constructor() {
    super('searchInput', true)
  }
  get address() {
    return $$$('searchInput')
  }
  get submit() {
    return $$$('Continuer vers l’étape suivante')
  }
}

class CompleteStatus extends AppScreen {
  constructor() {
    super('validate-off-icon', true)
  }
  get completeProfile() {
    return $$$('validate-off-icon')
  }
}

export const address = new RegistrationAddress()
export const city = new RegistrationCity()
export const firstname = new RegistrationFirstName()
export const name = new RegistrationName()
export const profile = new CompleteProfile()
export const statut = new CompleteStatus()
export const verifyId = new VerifyId()

export default new StepperScreens({
  address,
  city,
  firstname,
  name,
  profile,
  statut,
  verifyId,
})
