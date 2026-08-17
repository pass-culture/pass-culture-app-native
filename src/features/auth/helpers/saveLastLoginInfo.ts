import { maskEmail } from 'features/auth/helpers/maskEmail'
import { LastLoginInfo } from 'features/auth/types'
import { storage } from 'libs/storage'

export const saveLastLoginInfo = async ({
  email,
  provider,
}: {
  email: string
  provider: LastLoginInfo['provider']
}) => {
  const lastLoginInfo: LastLoginInfo = {
    maskedEmail: maskEmail(email),
    provider,
    lastLoginAt: new Date().toISOString(),
  }

  await storage.saveObject('last_login_info', lastLoginInfo)
}
