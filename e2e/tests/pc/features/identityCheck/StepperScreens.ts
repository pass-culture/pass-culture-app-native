import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'

type IRegistrationScreens = {
  verifyId: VerifyId
  profile: CompleteProfile
  statut: CompleteStatut
  firstname: RegistrationFirstName
  name: RegistrationName
  city: RegistrationCity
  address: RegistrationAddress
}

class StepperScreens extends AppScreen {
  verifyIdScreen: VerifyId
  completeStatutScreen: CompleteStatut
  completeProfileScreen: CompleteProfile
  firstnameScreen: RegistrationFirstName
  nameScreen: RegistrationName
  cityScreen: RegistrationCity
  addressScreen: RegistrationAddress
  constructor(screens: IRegistrationScreens) {
    super('Stepper', true)
    this.verifyIdScreen = screens.verifyId
    this.completeStatutScreen = screens.statut
    this.completeProfileScreen = screens.profile
    this.firstnameScreen = screens.firstname
    this.nameScreen = screens.name
    this.cityScreen = screens.city
    this.addressScreen = screens.address
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
  get completeProfil() {
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

  CityOption(city: string) {
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

class CompleteStatut extends AppScreen {
  constructor() {
    super('validate-off-icon', true)
  }
  get completeProfil() {
    return $$$('validate-off-icon')
  }
}

export const firstname = new RegistrationFirstName()

export const name = new RegistrationName()

export const address = new RegistrationAddress()

export const city = new RegistrationCity()

export const verifyId = new VerifyId()

export const profile = new CompleteProfile()

export const statut = new CompleteStatut()

export default new StepperScreens({
  address,
  firstname,
  name,
  city,
  verifyId,
  profile,
  statut,
})
