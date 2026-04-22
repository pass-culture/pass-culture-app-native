import { UserProfile } from 'features/share/types'

type Props = { user: UserProfile | undefined }

export const getShouldDisplayHelpButton = ({ user }: Props): boolean => {
  if (user) {
    return !user.isBeneficiary
  }
  return true
}
