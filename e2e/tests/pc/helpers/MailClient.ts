import { simpleParser } from 'mailparser'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const phoneValidationCodeEmail = readFileSync(
  resolve(__dirname, 'eml_tests/Code de validation du téléphone.eml'),
  'utf8'
)
const confirmEmail = readFileSync(resolve(__dirname, 'eml_tests/Confirme ton email.eml'), 'utf8')
const existingEmail = readFileSync(resolve(__dirname, 'eml_tests/On se connaît, non _.eml'), 'utf8')
const forgottenPasswordEmail = readFileSync(
  resolve(__dirname, 'eml_tests/Ton nouveau mot de passe.eml'),
  'utf8'
)
const activationConfirmationEmail = readFileSync(
  resolve(__dirname, 'eml_tests/Ton pass Culture est activé !.eml'),
  'utf8'
)

const happy18BirthdayEmail = readFileSync(
  resolve(__dirname, 'eml_tests/Joyeux anniversaire 🎂.eml'),
  'utf8'
)

class MailClient {
  /** link= domain restriction is already active in firebase */
  allowedFdlDomaines = [
    'passcultureapptesting.page.link',
    'passcultureappstaging.page.link',
    'passcultureapp.page.link', // TODO: remove when not using eml sources but real mailbox
  ]
  allowedDomaines = [
    'app.testing.passculture.team',
    'app.staging.passculture.team',
    'passculture.app', // TODO: remove when not using eml sources but real mailbox
  ]
  validationCodeRe = new RegExp('(\\d{6}) est ton code de confirmation pass Culture')
  confirmEmailRe = new RegExp(
    `\\[\\*?\\*?Confirmer mon adresse email\\*?\\*?\\]\\((https?:\\/\\/(${this.allowedFdlDomaines
      .join('|')
      .replace(/\./g, '\\.')})\\/\\?link=(.*))\\)`
  )
  existingEmailRe = new RegExp(
    `\\[\\*?\\*?Réinitialiser mon mot de passe\\*?\\*?]\\((https?:\\/\\/(${this.allowedFdlDomaines
      .join('|')
      .replace(/\./g, '\\.')})\\/\\?link=(.*))\\)`
  )
  forgottenPasswordEmailRe = new RegExp(
    `\\[\\*?\\*?Définir un nouveau mot de passe\\*?\\*?]\\((https?:\\/\\/(${this.allowedFdlDomaines
      .join('|')
      .replace(/\./g, '\\.')})\\/\\?link=(.*))\\)`
  )

  activationConfirmationEmailRe = new RegExp(
    `\\[\\*?\\*?Découvre les offres sur le pass ⚡\\*?\\*?]\\((https?:\\/\\/(${this.allowedFdlDomaines
      .join('|')
      .replace(/\./g, '\\.')})\\/(.*))\\)`
  )

  happy18BirthdayEmailRe = new RegExp(
    `\\[\\*?\\*?Obtenir mes 300 €\\*?\\*?]\\((https?:\\/\\/(${this.allowedDomaines
      .join('|')
      .replace(/\./g, '\\.')})\\/(.*))\\)`
  )

  async validationCode() {
    const mail = await simpleParser(phoneValidationCodeEmail)
    const res = mail.text && this.validationCodeRe.exec(mail.text)
    return res instanceof Array && res[1]
  }

  async confirmEmailFdl() {
    const mail = await simpleParser(confirmEmail)
    const res = mail.text && this.confirmEmailRe.exec(mail.text)
    console.log(mail)
    return res instanceof Array && res[1]
  }

  async existingEmail() {
    const mail = await simpleParser(existingEmail)
    const res = mail.text && this.existingEmailRe.exec(mail.text)
    return res instanceof Array && res[1]
  }

  async forgottenPasswordEmail() {
    const mail = await simpleParser(forgottenPasswordEmail)
    const res = mail.text && this.forgottenPasswordEmailRe.exec(mail.text)
    return res instanceof Array && res[1]
  }

  async activationConfirmationEmail() {
    const mail = await simpleParser(activationConfirmationEmail)
    const res = mail.text && this.activationConfirmationEmailRe.exec(mail.text)
    return res instanceof Array && res[1]
  }

  async happy18BirthdayEmail() {
    const mail = await simpleParser(happy18BirthdayEmail)
    const res = mail.text && this.happy18BirthdayEmailRe.exec(mail.text)
    return res instanceof Array && res[1]
  }
}

let i = 0
const mailClient = new MailClient()

// mailClient
//   .validationCode()
//   .then(console.log)
//   .then(() => console.log(++i))
mailClient
  .confirmEmailFdl()
  .then(console.log)
  .then(() => console.log(++i))
// mailClient
//   .existingEmail()
//   .then(console.log)
//   .then(() => console.log(++i))
// mailClient
//   .forgottenPasswordEmail()
//   .then(console.log)
//   .then(() => console.log(++i))
// mailClient
//   .activationConfirmationEmail()
//   .then(console.log)
//   .then(() => console.log(++i))
// mailClient
//   .happy18BirthdayEmail()
//   .then(console.log)
//   .then(() => console.log(++i))

export default mailClient
