import { isBefore, isAfter } from 'date-fns'

import { logEvent } from './utils/logger'
import { timeout } from './utils/time'
import { authenticate } from '@google-cloud/local-auth'
import { OAuth2Client } from 'google-auth-library'
import { AddressObject, ParsedMail, simpleParser } from 'mailparser'
import { join } from 'path'
import { cwd } from 'process'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { google } from 'googleapis'
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth'
import { env } from '../../../config/environment/env'

type GmailFetchOptions = {
  username: string
  dateFrom?: Date
  waitMaxMs?: number
  retryAfterMs?: number
  maxRetry?: number
  offsetLeftMs?: number
}

const gmailFetchOptionsDefaults = {
  maxRetry: 9,
  retryAfterMs: 5000,
  waitMaxMs: 45000,
  strategy: 'desc',
  offsetLeftMs: 1000,
}

export type Email = ParsedMail & {
  id: string
}

export default class GmailClient {
  private static SCOPES = ['https://mail.google.com/']

  private static TOKEN_PATH = join(cwd(), 'token.json')

  private static CREDENTIALS_PATH = join(cwd(), 'credentials.json')

  private static ALLOWED_FDL_DOMAINES = [
    'passcultureapptesting.page.link',
    'passcultureappstaging.page.link',
    'passcultureapptestauto.page.link',
  ]

  private static ALLOWED_DOMAINES = [
    'app.testing.passculture.team',
    'app.staging.passculture.team',
    'webapp-v2.example.com',
  ]

  private static VALIDATION_CODE_RE = new RegExp(
    '(\\d{6}) est ton code de confirmation pass Culture'
  )

  private static CONFIRM_EMAIL_RE = new RegExp(
    `\\[\\*?\\*?Confirmer mon adresse email\\*?\\*?\\]\\((https?:\\/\\/(${GmailClient.ALLOWED_FDL_DOMAINES.join(
      '|'
    ).replace(/\./g, '\\.')})\\/\\?link=(.*))\\)`
  )

  private static EXISTING_EMAIL_RE = new RegExp(
    `\\[\\*?\\*?Réinitialiser mon mot de passe\\*?\\*?]\\((https?:\\/\\/(${GmailClient.ALLOWED_FDL_DOMAINES.join(
      '|'
    ).replace(/\./g, '\\.')})\\/\\?link=(.*))\\)`
  )

  private static FORGOTTEN_PASSWORD_EMAIL_RE = new RegExp(
    `\\[\\*?\\*?Définir un nouveau mot de passe\\*?\\*?]\\((https?:\\/\\/(${GmailClient.ALLOWED_FDL_DOMAINES.join(
      '|'
    ).replace(/\./g, '\\.')})\\/\\?link=(.*))\\)`
  )

  private static ACTIVATION_CONFIRMATION_EMAIL_RE = new RegExp(
    `\\[\\*?\\*?Découvre les offres sur le pass ⚡\\*?\\*?]\\((https?:\\/\\/(${GmailClient.ALLOWED_FDL_DOMAINES.join(
      '|'
    ).replace(/\./g, '\\.')})\\/(.*))\\)`
  )

  private static HAPPY_18_BIRTHDAY_EMAIL_RE = new RegExp(
    `\\[\\*?\\*?Obtenir mes 300 €\\*?\\*?]\\((https?:\\/\\/(${GmailClient.ALLOWED_DOMAINES.join(
      '|'
    ).replace(/\./g, '\\.')})\\/(.*))\\)`
  )

  public inboxLastFetchDate: Date

  public inboxEmails: Email[]

  constructor() {
    this.inboxEmails = []
    this.inboxLastFetchDate = new Date()
  }

  public static randomUniqueUsername(alias?: string) {
    const parts = env.END_TO_END_TESTS_EMAIL_ADDRESS.split('@')
    return `${parts[0]}+${alias ?? new Date().getTime()}@${parts[1]}`
  }

  private static async getEmailParams(email: Email | undefined, regEx: RegExp) {
    if (!email?.text) {
      return
    }

    const res = regEx.exec(email.text)
    try {
      if (res) {
        const auth = await GmailClient.authorize()
        const gmail = google.gmail({ version: 'v1', auth })
        await gmail.users.messages.delete({
          userId: 'me',
          id: email.id,
        })
      }
    } catch (error) {
      logEvent(
        'GmailClient',
        `Cannot delete email "${
          email?.subject
        }" with date "${email?.date?.toISOString()}": ${error}`
      )
    }
    return res
  }

  /**
   * Load or request or authorization to call APIs.
   *
   */
  private static authorize = async () => {
    let client: JSONClient | OAuth2Client | null = await GmailClient.loadSavedCredentialsIfExist()
    if (client) {
      return client
    }
    if (!existsSync(GmailClient.CREDENTIALS_PATH)) {
      throw new Error(
        `OAuth2 credentials.json not found in ${cwd()}${env.CI ? ': Not supported in CI' : ''}`
      )
    }
    client = await authenticate({
      scopes: GmailClient.SCOPES,
      keyfilePath: GmailClient.CREDENTIALS_PATH,
    })
    if (client.credentials) {
      await GmailClient.saveCredentials(client)
    }
    return client
  }

  /**
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  private static loadSavedCredentialsIfExist = async () => {
    try {
      const exist = existsSync(GmailClient.TOKEN_PATH)
      if (!exist) {
        logEvent('GmailClient', `token.json not found in ${cwd()}`)
      }
      const content = readFileSync(GmailClient.TOKEN_PATH, 'utf8')
      const credentials = JSON.parse(content)
      return google.auth.fromJSON(credentials)
    } catch {
      return null
    }
  }

  /**
   * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
   *
   * @param {OAuth2Client} client
   * @return {Promise<void>}
   */
  private static saveCredentials = async (client: OAuth2Client) => {
    const content = readFileSync(GmailClient.CREDENTIALS_PATH, 'utf8')
    const keys = JSON.parse(content)
    const key = keys.installed || keys.web
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    })
    await writeFileSync(GmailClient.TOKEN_PATH, payload, 'utf8')
  }

  private fetch = async () => {
    try {
      logEvent('GmailClient', 'Fetching emails...')
      this.inboxLastFetchDate = new Date()
      const auth = await GmailClient.authorize()
      const gmail = google.gmail({ version: 'v1', auth })
      const res = await gmail.users.messages.list({
        userId: 'me',
      })
      const { messages } = res.data
      if (!messages || messages.length === 0) {
        return []
      }

      const emails: Email[] = []
      for (let i = 0; i < messages.length; i += 1) {
        const id = String(messages[i].id)
        const { data } = await gmail.users.messages.get({
          id,
          userId: 'me',
          format: 'raw',
        })
        if (data?.raw) {
          const eml = atob(data.raw.replace(/-/g, '+').replace(/_/g, '/'))
          const email: Email = { ...(await simpleParser(eml)), id }
          emails.push(email)
        }
      }

      this.inboxEmails = emails

      logEvent('GmailClient', `Found ${emails.length} email${emails.length ? 's' : ''}.`)
    } catch (error) {
      const event = `Failed to fetch emails: ${error}`
      logEvent('GmailClient', event)
    }
    return this.inboxEmails
  }

  private makeFindOne = (opts: GmailFetchOptions) => (email: Email) => {
    let cursor: Email | undefined

    if (opts.username && email.to) {
      const tos: AddressObject[] = Array.isArray(email.to) ? email.to : [email.to]
      tos.forEach((to) => {
        to.value.forEach(({ address }) => {
          if (address === opts.username) {
            cursor = email
          }
        })
      })
    }
    if (cursor?.date && opts.dateFrom && opts.offsetLeftMs !== undefined) {
      cursor = isAfter(cursor.date, new Date(opts.dateFrom.getTime() - opts.offsetLeftMs))
        ? email
        : undefined
    }
    if (cursor?.date && opts.dateFrom && opts.waitMaxMs) {
      cursor = isBefore(cursor.date, new Date(opts.dateFrom.getTime() + opts.waitMaxMs))
        ? email
        : undefined
    }

    return !!cursor
  }

  private makeFilterOnSubject(subject: string) {
    return (email: Email) => subject == email.subject
  }

  private findOne = async (gmailFetchOptions: GmailFetchOptions, subject: string) => {
    const emails: Email[] = await this.fetch()
    let filteredEmails = emails.filter(this.makeFilterOnSubject(subject))
    return filteredEmails.find(this.makeFindOne(gmailFetchOptions))
  }

  private findOneWithRetries = async (gmailFetchOptions: GmailFetchOptions, subject: string) => {
    let email: Email | undefined
    const options = { ...gmailFetchOptionsDefaults, ...gmailFetchOptions }
    let maxRetry = options.maxRetry
    let retryAfterMs = options.retryAfterMs
    while (!email && --maxRetry >= 0) {
      email = await this.findOne(options, subject)
      if (!email && maxRetry !== 0) {
        await timeout(retryAfterMs)
      }
    }
    return email
  }

  public getRegistrationConfirmationEmail = async (gmailFetchOptions: GmailFetchOptions) => {
    const email = await this.findOneWithRetries(gmailFetchOptions, 'Confirme ton email')
    const matches = await GmailClient.getEmailParams(email, GmailClient.CONFIRM_EMAIL_RE)
    if (!matches) {
      return
    }
    return { ...email, params: { CONFIRMATION_LINK: matches[1] } }
  }

  public getForgottenPasswordEmail = async (gmailFetchOptions: GmailFetchOptions) => {
    const email = await this.findOneWithRetries(gmailFetchOptions, 'Ton nouveau mot de passe')
    const matches = await GmailClient.getEmailParams(email, GmailClient.FORGOTTEN_PASSWORD_EMAIL_RE)
    if (!matches) {
      return
    }
    return { ...email, params: { CONFIRMATION_LINK: matches[1] } }
  }

  public getValidationCodeEmail = async (gmailFetchOptions: GmailFetchOptions) => {
    const email = await this.findOneWithRetries(
      gmailFetchOptions,
      'Code de validation du téléphone'
    )
    const matches = await GmailClient.getEmailParams(email, GmailClient.VALIDATION_CODE_RE)
    if (!matches) {
      return
    }
    return { ...email, params: { CONFIRMATION_LINK: matches[1] } }
  }

  public getExistingEmail = async (gmailFetchOptions: GmailFetchOptions) => {
    const email = await this.findOneWithRetries(gmailFetchOptions, 'On se connaît, non ?')
    const matches = await GmailClient.getEmailParams(email, GmailClient.EXISTING_EMAIL_RE)
    if (!matches) {
      return
    }
    return { ...email, params: { CONFIRMATION_LINK: matches[1] } }
  }

  public getActivationConfirmationEmail = async (gmailFetchOptions: GmailFetchOptions) => {
    const email = await this.findOneWithRetries(gmailFetchOptions, 'Ton pass Culture est activé !')
    const matches = await GmailClient.getEmailParams(
      email,
      GmailClient.ACTIVATION_CONFIRMATION_EMAIL_RE
    )
    if (!matches) {
      return
    }
    return { ...email, params: { CONFIRMATION_LINK: matches[1] } }
  }

  public getHappy18BirthdayEmail = async (gmailFetchOptions: GmailFetchOptions) => {
    const email = await this.findOneWithRetries(gmailFetchOptions, 'Joyeux anniversaire 🎂')
    const matches = await GmailClient.getEmailParams(email, GmailClient.HAPPY_18_BIRTHDAY_EMAIL_RE)
    if (!matches) {
      return
    }
    return { ...email, params: { CONFIRMATION_LINK: matches[1] } }
  }
}
