import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { isAndWasBeneficiary } from 'shared/user/checkStatus'

type Props = { user: UserProfileResponseWithoutSurvey | undefined }

export const getShouldDisplayHelpButton = ({ user }: Props): boolean => {
  if (user) {
    return !isAndWasBeneficiary(user.statusType)
  }
  return true
}
