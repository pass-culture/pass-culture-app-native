import AppScreen from '../../screenobjects/AppScreen'
import { $$$ } from '../../helpers/utils/selector'
import { flags } from '../../helpers/utils/platform'
import { DefaultTheme } from '../../helpers/utils/theme'
import { timeout } from '../../helpers/utils/time'

type IRegistrationScreens = {
  email: RegistrationEmail
  password: RegistrationPassword
  birthDate: RegistrationBirthDate
  acceptCgu: RegistrationAcceptCgu
  signupConfirmationEmailSent: SignupConfirmationEmailSent
}

class SignupScreens extends AppScreen {
  emailScreen: RegistrationEmail
  passwordScreen: RegistrationPassword
  birthDateScreen: RegistrationBirthDate
  acceptCguScreen: RegistrationAcceptCgu
  signupConfirmationEmailSentScreen: SignupConfirmationEmailSent

  constructor(screens: IRegistrationScreens) {
    super('SignupForm', true)
    this.emailScreen = screens.email
    this.passwordScreen = screens.password
    this.birthDateScreen = screens.birthDate
    this.acceptCguScreen = screens.acceptCgu
    this.signupConfirmationEmailSentScreen = screens.signupConfirmationEmailSent
  }
}

class RegistrationEmail extends AppScreen {
  constructor() {
    super('Entrée pour l’email', true)
  }
  get email() {
    return $$$('Entrée pour l’email')
  }

  get newsletterCheckbox() {
    return $$$(
      'J’accepte de recevoir les newsletters, bons plans et recommandations personnalisées du pass Culture.'
    )
  }

  get submit() {
    return $$$('Continuer vers l’étape Mot de passe')
  }

  get goToLogin() {
    return $$$('Se connecter')
  }
}

class RegistrationPassword extends AppScreen {
  constructor() {
    super('Mot de passe', true)
  }

  get password() {
    return $$$('Mot de passe')
  }

  get togglePasswordVisibility() {
    return $$$('Afficher le mot de passe')
  }

  get submit() {
    return $$$('Continuer vers l’étape Date de naissance')
  }
}

export class RegistrationBirthDate extends AppScreen {
  public static MONTHS_BROWSER_DESKTOP = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ]
  public static MONTHS_IOS_NATIVE = RegistrationBirthDate.MONTHS_BROWSER_DESKTOP
  public static MONTHS_ANDROID_NATIVE = RegistrationBirthDate.MONTHS_BROWSER_DESKTOP.map((m) =>
    m.toLowerCase()
  )

  constructor() {
    super('Continuer vers l’étape CGU & Données', true)
  }

  setBirthDate = async (birthDate: Date, theme: DefaultTheme) => {
    if (flags.isWeb) {
      if (theme.isTouch) {
        const hiddenInput = $$$('hidden-input-birthdate')
        await hiddenInput.clearValue()
        await hiddenInput.setValue(birthDate.toISOString())
      } else {
        await $$$('select-Année').selectByAttribute('value', String(birthDate.getFullYear()))
        await $$$('select-Mois').selectByAttribute(
          'value',
          RegistrationBirthDate.MONTHS_BROWSER_DESKTOP[birthDate.getMonth()]
        )
        await $$$('select-Jour').selectByAttribute('value', String(birthDate.getDate()))
      }
    } else if (flags.isAndroid) {
      const buttons = $$('android.widget.Button')
      const dayPreviousButton = await buttons[2]
      const dayNextBtn = await buttons[3]
      const monthPreviousButton = await buttons[4]
      const monthNextButton = await buttons[5]
      const yearPreviousButton = await buttons[6]
      const yearNextButton = await buttons[7]

      const inputs = await $$('android.widget.EditText')

      const initialDay = Number(await inputs[0]?.getText())
      const initialMonth = RegistrationBirthDate.MONTHS_ANDROID_NATIVE.indexOf(
        await inputs[1]?.getText()
      )
      const initialYear = Number(await inputs[2]?.getText())

      // month
      for (let i = 0; i < Math.abs(initialMonth - birthDate.getMonth()); i++) {
        initialMonth > birthDate.getMonth()
          ? await monthPreviousButton!.click()
          : await monthNextButton!.click()
      }

      // year
      for (let i = 0; i < Math.abs(initialYear - birthDate.getFullYear()); i++) {
        initialYear > birthDate.getFullYear()
          ? await yearPreviousButton!.click()
          : await yearNextButton!.click()
      }

      // day in last, to avoid bug due to month change
      for (let i = 0; i < Math.abs(initialDay - birthDate.getDate()); i++) {
        initialDay > birthDate.getDate()
          ? await dayPreviousButton!.click()
          : await dayNextBtn!.click()
      }
    } else if (flags.isIOS) {
      const datePicker = $('-ios class chain:**/XCUIElementTypeDatePicker')
      const datePickerWheels = datePicker.$$('-ios class chain:**/XCUIElementTypePickerWheel')

      const initialDate = Number(await datePickerWheels[0].getValue())
      const initialMonth = RegistrationBirthDate.MONTHS_IOS_NATIVE.indexOf(
        await datePickerWheels[1].getValue()
      )
      const initialYear = Number(await datePickerWheels[2].getValue())

      // month
      for (let i = 0; i < Math.abs(initialMonth - birthDate.getMonth()); i++) {
        await driver.execute('mobile: selectPickerWheelValue', {
          order: initialMonth > birthDate.getMonth() ? 'previous' : 'next',
          offset: 0.15,
          element: await datePickerWheels[1].elementId,
        })
      }

      // year
      for (let i = 0; i < Math.abs(initialYear - birthDate.getFullYear()); i++) {
        await driver.execute('mobile: selectPickerWheelValue', {
          order: initialYear > birthDate.getFullYear() ? 'previous' : 'next',
          offset: 0.15,
          element: await datePickerWheels[2].elementId,
        })
      }

      // day in last, to avoid bug due to month change
      for (let i = 0; i < Math.abs(initialDate - birthDate.getDate()); i++) {
        await driver.execute('mobile: selectPickerWheelValue', {
          order: initialDate > birthDate.getDate() ? 'previous' : 'next',
          offset: 0.15,
          element: await datePickerWheels[0].elementId,
        })
      }
    }
  }

  get submit() {
    return $$$('Continuer vers l’étape CGU & Données')
  }
}

class RegistrationAcceptCgu extends AppScreen {
  constructor() {
    super(
      'Accepter les conditions générales d’utilisation et la politique de confidentialité pour s’inscrire',
      true
    )
  }

  get submit() {
    return $$$(
      'Accepter les conditions générales d’utilisation et la politique de confidentialité pour s’inscrire'
    )
  }
}

class SignupConfirmationEmailSent extends AppScreen {
  constructor() {
    super('SignupConfirmationEmailSent', true)
  }

  get close() {
    return $$$('Abandonner l’inscription')
  }

  get back() {
    return $$$('Revenir en arrière')
  }
}

export const email = new RegistrationEmail()

export const password = new RegistrationPassword()

export const birthDate = new RegistrationBirthDate()

export const acceptCgu = new RegistrationAcceptCgu()

export const signupConfirmationEmailSent = new SignupConfirmationEmailSent()

export default new SignupScreens({
  email,
  password,
  birthDate,
  acceptCgu,
  signupConfirmationEmailSent,
})
