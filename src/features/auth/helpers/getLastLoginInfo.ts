import { FormattedLastLoginInfo, LastLoginInfo } from 'features/auth/types'
import { storage } from 'libs/storage'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Apple } from 'ui/svg/icons/socialNetwork/Apple'
import { Google } from 'ui/svg/icons/socialNetwork/Google'

const getProvider = (
  provider: LastLoginInfo['provider']
): FormattedLastLoginInfo['provider'] | null => {
  switch (provider) {
    case 'google':
      return { label: 'Google', icon: Google }
    case 'apple':
      return { label: 'Apple', icon: Apple }
    case 'email':
      return { label: 'E-mail', icon: EmailFilled }
    default:
      return null
  }
}

const formatLastLoginDate = (date: string): string => {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR').format(parsedDate)
}

export const getLastLoginInfo = async (): Promise<FormattedLastLoginInfo | null> => {
  const lastLoginInfo = await storage.readObject<LastLoginInfo>('last_login_info')
  if (!lastLoginInfo) return null

  const provider = getProvider(lastLoginInfo.provider)
  if (!provider) return null

  return {
    maskedEmail: lastLoginInfo.maskedEmail,
    provider,
    lastLoginAt: formatLastLoginDate(lastLoginInfo.lastLoginAt),
  }
}
