import { UserProfile } from 'features/share/types'
import { isCurrentOrFormerBeneficiary } from 'shared/user/checkStatusType'

type Props = { user: UserProfile | undefined }

export const getShouldDisplayHelpButton = ({ user }: Props): boolean => {
  if (user) {
    return !isCurrentOrFormerBeneficiary(user)
  }
  return true
}
