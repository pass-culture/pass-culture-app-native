import { t } from '@lingui/macro'

import { CategoryType } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { _ } from 'libs/i18n'

interface CtaWordingI {
  categoryType: CategoryType
}

export const useCtaWording = ({ categoryType }: CtaWordingI) => {
  const { isLoggedIn } = useAuthContext()
  const { data: profileInfo } = useUserProfileInfo()
  if (!isLoggedIn || (profileInfo && !profileInfo.isBeneficiary))
    return categoryType === CategoryType.Event
      ? _(t`Accéder à la billetterie externe`)
      : _(t`Accéder à l'offre`)
  return _(t`Voir les disponibilités`)
}
