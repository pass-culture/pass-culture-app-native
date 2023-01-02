import { isAppUrl } from 'features/navigation/helpers'

const OPEN_INBOX_URL_PART = 'openInbox'

export const shouldOpenInbox = (url: string) => {
  return !!(isAppUrl(url) && url.match(OPEN_INBOX_URL_PART))
}
