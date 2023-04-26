import FirstLaunch from '../helpers/FirstLaunch'
import { TabBar } from '../features/navigation/TabBar'
import { didFirstLaunch } from '../helpers/utils/error'
import { DefaultTheme, getTheme } from '../helpers/utils/theme'
import ProfileScreen from '../features/profile/ProfileScreen'
import SignupScreens from '../features/auth/SignupScreens'
import { getRandomInt } from '../helpers/utils/number'
import GmailClient, { Email } from '../helpers/GmailClient'
import { openDeepLinkUrl } from '../helpers/utils/deeplink'
import { timeout } from '../helpers/utils/time'
import VerifyEligibility from '../features/auth/VerifyEligibility'
import IdentityCheckStepper from '../features/identityCheck/IdentityCheckStepper'
import SetName from '../features/identityCheck/SetName'
import SetCity from '../features/identityCheck/SetCity'
import SetAddress from '../features/identityCheck/SetAddress'
import SetStatus from '../features/identityCheck/SetStatus'
import SetSchoolType from '../features/identityCheck/SetSchoolType'

type RegistrationConfirmationEmail = Omit<Email, 'params'> & {
  params: {
    CONFIRMATION_LINK: string
  }
}

describe('17YearsRegistration', () => {
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

    beforeEach(() => {
      didFirstLaunch(ok)
    })

    it('should click on "Créer un compte"', async () => {
      await ProfileScreen.waitForIsShown()
      await ProfileScreen.createAccount.click()
      await ProfileScreen.waitForIsHidden()
    })

    it('should set email and randomly accept newsletter checkbox', async () => {
      await SignupScreens.waitForIsShown()
      await SignupScreens.emailScreen.waitForIsShown()
      await SignupScreens.emailScreen.email.setValue(email)

      await SignupScreens.emailScreen.newsletterCheckbox.click()

      await timeout(2000)
      await SignupScreens.emailScreen.submit.click()
      await SignupScreens.emailScreen.waitForIsHidden()
    })

    it('should set password', async () => {
      await SignupScreens.waitForIsShown()
      await SignupScreens.passwordScreen.waitForIsShown()
      await SignupScreens.passwordScreen.password.waitForEnabled()
      await SignupScreens.passwordScreen.password.setValue(password)
      await SignupScreens.passwordScreen.submit.click()
      await SignupScreens.passwordScreen.waitForIsHidden()
    })

    it('should set birthdate to 17 years old', async () => {
      const birthDate = new Date(
        new Date().getFullYear() - 17, // year (17 years old)
        getRandomInt(0, new Date().getMonth()), // monthIndex
        getRandomInt(1, new Date().getDay()) // day
      )

      await SignupScreens.birthDateScreen.waitForIsShown()
      await SignupScreens.birthDateScreen.setBirthDate(birthDate, theme)
      await SignupScreens.birthDateScreen.submit.click()
      await SignupScreens.birthDateScreen.waitForIsHidden()
    })

    it('should pass recaptcha and post account registration to pcapi', async () => {
      await SignupScreens.acceptCguScreen.waitForIsShown()
      registrationDate = new Date()
      await SignupScreens.acceptCguScreen.submit.click()
      await SignupScreens.acceptCguScreen.waitForIsHidden()
      try {
        await SignupScreens.signupConfirmationEmailSentScreen.waitForIsShown()
      } catch {
        throw new Error('Re-CAPTCHA challenge not disabled')
      }
    })

    it('should receive registration confirmation email', async () => {
      registrationConfirmationEmail = (await gmailClient.getRegistrationConfirmationEmail({
        dateFrom: registrationDate,
        username: email,
      })) as RegistrationConfirmationEmail
      expect(registrationConfirmationEmail).toBeDefined()
      await SignupScreens.signupConfirmationEmailSentScreen.waitForIsShown()
    })

    it('should open registration confirmation email link and perform log in', async () => {
      const url = new URL(registrationConfirmationEmail.params.CONFIRMATION_LINK)
      await openDeepLinkUrl(url.href)
      await SignupScreens.signupConfirmationEmailSentScreen.waitForIsHidden()
    })

    it('should click on start verification', async () => {
      didFirstLaunch(ok)
      await VerifyEligibility.waitForIsShown()
      await VerifyEligibility.start.click()
      await VerifyEligibility.waitForIsHidden()
    })

    it('should click on profile step button', async () => {
      didFirstLaunch(ok)
      await IdentityCheckStepper.waitForIsShown()
      await IdentityCheckStepper.profileButton.click()
      await IdentityCheckStepper.waitForIsHidden()
    })

    it('should set first name and last name', async () => {
      didFirstLaunch(ok)
      await SetName.waitForIsShown()
      await SetName.firstNameInput.setValue('John')
      await SetName.lastNameInput.setValue('Doe')
      await SetName.continueButton.click()
      await SetName.waitForIsHidden()
    })

    it('should set postal code and select city', async () => {
      didFirstLaunch(ok)
      await SetCity.waitForIsShown()
      await SetCity.postalCodeInput.setValue('75017')
      await SetCity.cityOption.waitForDisplayed()
      await SetCity.cityOption.click()
      await SetCity.submitButton.click()
      await SetCity.waitForIsHidden()
    })

    it('should set address', async () => {
      didFirstLaunch(ok)
      await SetAddress.waitForIsShown()
      await SetAddress.addressInput.setValue('25 rue de la Boétie')
      await SetAddress.submitButton.click()
      await SetAddress.waitForIsHidden()
    })

    it('should set status', async () => {
      didFirstLaunch(ok)
      await SetStatus.waitForIsShown()
      await SetStatus.statusOption.click()
      await SetStatus.submitButton.click()
      await SetStatus.waitForIsHidden()
    })

    it('should set school type', async () => {
      didFirstLaunch(ok)
      await SetSchoolType.waitForIsShown()
      await SetSchoolType.schoolTypeOption.click()
      await SetSchoolType.submitButton.click()
      await SetSchoolType.waitForIsHidden()
    })
  })
})
