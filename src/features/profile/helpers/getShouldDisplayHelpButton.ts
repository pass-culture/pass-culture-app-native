import { isAndWasBeneficiary } from 'features/auth/helpers/checkStatusType'
import { UserProfile } from 'features/share/types'

type Props = { user: UserProfile | undefined }

export const getShouldDisplayHelpButton = ({ user }: Props): boolean => {
  if (user) {
    return !isAndWasBeneficiary(user)
  }
  return true
}
