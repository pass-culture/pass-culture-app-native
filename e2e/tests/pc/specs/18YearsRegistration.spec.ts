import FirstLaunch from '../helpers/FirstLaunch'
import { TabBar } from '../features/navigation/TabBar'
import { didFirstLaunch } from '../helpers/utils/error'
import { DefaultTheme, getTheme } from '../helpers/utils/theme'
import ProfileScreen from '../features/profile/ProfileScreen'
import SignupScreens from '../features/auth/SignupScreens'
import { getRandomInt } from '../helpers/utils/number'
import GmailClient, { Email } from '../helpers/GmailClient'
import { openDeepLinkUrl } from '../helpers/utils/deeplink'
import { flags } from '../helpers/utils/platform'
import { getBrightness } from 'react-native-device-info'
import StepperScreens, {
  firstname,
  name,
  profile,
  verifyId,
} from '../features/identityCheck/StepperScreens'

type RegistrationConfirmationEmail = Omit<Email, 'params'> & {
  params: {
    CONFIRMATION_LINK: string
  }
}

describe('18YearsRegistration', () => {
  let ok = false
  let tabBar: TabBar
  let theme: DefaultTheme

  before(async () => {
    theme = getTheme(await browser.getWindowSize())
    tabBar = new TabBar(theme)
  })

  it('should first launch app', async () => {
    ok = await FirstLaunch.init(tabBar)
  })

  it('should click on home', async () => {
    didFirstLaunch(ok)
    await tabBar.home.click()
  })

  it('should click on search', async () => {
    didFirstLaunch(ok)
    await tabBar.search.click()
  })

  it('should click on favorite', async () => {
    didFirstLaunch(ok)
    await tabBar.favorite.click()
  })

  it('should click on profile', async () => {
    didFirstLaunch(ok)
    await tabBar.profil.click()
  })

  describe('profile registration', () => {
    const email = GmailClient.randomUniqueUsername()
    const password = 'user@AZERTY123'
    const gmailClient = new GmailClient()
    let registrationDate = new Date()
    let registrationConfirmationEmail: RegistrationConfirmationEmail

    it('should click on "Créer un compte"', async () => {
      didFirstLaunch(ok)
      await ProfileScreen.waitForIsShown(true)
      if (flags.isWeb) {
        // await ProfileScreen.createAccount.click() fail to click with error: element not interactable
        // This is a DOM click workaround:
        await browser.execute('arguments[0].click();', await ProfileScreen.createAccount)
      } else {
        await ProfileScreen.createAccount.click()
      }
      await ProfileScreen.waitForIsShown(false)
    })

    it('should set email and randomly accept newsletter checkbox', async () => {
      didFirstLaunch(ok)
      await SignupScreens.waitForIsShown(true)
      await SignupScreens.emailScreen.waitForIsShown(true)
      await SignupScreens.emailScreen.email.setValue(email)

      if (getRandomInt(0, 1) === 1) {
        await SignupScreens.emailScreen.newsletterCheckbox.click()
      }

      await SignupScreens.emailScreen.submit.click()
      await SignupScreens.emailScreen.waitForIsShown(false)
    })

    it('should set password', async () => {
      didFirstLaunch(ok)
      await SignupScreens.waitForIsShown(true)
      await SignupScreens.passwordScreen.waitForIsShown(true)
      await SignupScreens.passwordScreen.password.waitForEnabled()
      await SignupScreens.passwordScreen.password.setValue(password)
      await SignupScreens.passwordScreen.submit.click()
      await SignupScreens.passwordScreen.waitForIsShown(false)
    })

    it('should set birthdate to 18 years old', async () => {
      didFirstLaunch(ok)
      const birthDate = new Date(
        new Date().getFullYear() - 18, // year (18 year's old)
        getRandomInt(0, new Date().getMonth()), // monthIndex
        getRandomInt(1, new Date().getDay()) // day
      )

      await SignupScreens.birthDateScreen.waitForIsShown(true)
      await SignupScreens.birthDateScreen.setBirthDate(birthDate, theme)
      await SignupScreens.birthDateScreen.submit.click()
      await SignupScreens.birthDateScreen.waitForIsShown(false)
    })

    it('should pass recaptcha and post account registration to pcapi', async () => {
      didFirstLaunch(ok)
      await SignupScreens.acceptCguScreen.waitForIsShown(true)
      registrationDate = new Date()
      await SignupScreens.acceptCguScreen.submit.click()
      await SignupScreens.acceptCguScreen.waitForIsShown(false)
      try {
        await SignupScreens.signupConfirmationEmailSentScreen.waitForIsShown(true)
      } catch {
        throw new Error('Re-CAPTCHA challenge not disabled')
      }
    })

    it('should receive registration confirmation email', async () => {
      didFirstLaunch(ok)
      registrationConfirmationEmail = (await gmailClient.getRegistrationConfirmationEmail({
        dateFrom: registrationDate,
        username: email,
      })) as RegistrationConfirmationEmail
      expect(registrationConfirmationEmail).toBeDefined()
      await SignupScreens.signupConfirmationEmailSentScreen.waitForIsShown(true)
    })

    it('should open registration confirmation email link and perform log in', async () => {
      didFirstLaunch(ok)
      const url = new URL(registrationConfirmationEmail.params.CONFIRMATION_LINK)
      await openDeepLinkUrl(url.href)
      await SignupScreens.signupConfirmationEmailSentScreen.waitForIsShown(false)
    })
  })
  /*
  describe('identity check', () => {
    it('should start identity verification', async () => {
      didFirstLaunch(ok)
      await verifyId.waitForIsShown(true)
      await verifyId.idcheck.click()
    })
    it('should complete profile', async () => {
      didFirstLaunch(ok)
      await profile.waitForIsShown(true)
      await profile.completeProfil.click()
    })
    it('should set firstname name', async () => {
      const prenom = 'prenom'
      didFirstLaunch(ok)
      await firstname.waitForIsShown(true)
      await firstname.firstname.setValue(prenom)
    })
    it('should set name', async () => {
      const nom = 'nom'
      didFirstLaunch(ok)
      await name.waitForIsShown(true)
      await name.name.setValue(nom)
      await name.submit.click()
      await name.waitForIsShown(false)
    })
  })
   */
})
