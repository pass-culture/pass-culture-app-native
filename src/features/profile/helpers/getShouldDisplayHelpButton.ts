import { UserProfileResponseWithoutSurvey } from 'features/share/types'

type Props = { user: UserProfileResponseWithoutSurvey | undefined }

export const getShouldDisplayHelpButton = ({ user }: Props): boolean => {
  if (user) {
    return !user.isBeneficiary
  }
  return true
}
