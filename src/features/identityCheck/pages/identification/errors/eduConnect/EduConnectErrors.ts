import { useRoute } from '@react-navigation/native'

import { logoutFromEduConnectIfAllowed } from 'features/identityCheck/api/logoutFromEduConnectIfAllowed'
import { withEduConnectErrorBoundary } from 'features/identityCheck/pages/identification/errors/eduConnect/EduConnectErrorBoundary'
import { EduConnectError } from 'features/identityCheck/pages/identification/errors/eduConnect/types'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { UseRouteType } from 'features/navigation/RootNavigator/types'

export const EduConnectErrors = withEduConnectErrorBoundary(() => {
  const { params } = useRoute<UseRouteType<'EduConnectErrors'>>()
  const logoutUrl = params.logoutUrl
  logoutFromEduConnectIfAllowed(logoutUrl)

  if (params?.code === 'UserAgeNotValid18YearsOld') {
    throw new EduConnectError(EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld)
  } else if (params?.code === 'UserAgeNotValid') {
    throw new EduConnectError(EduConnectErrorMessageEnum.UserAgeNotValid)
  } else if (params?.code === 'UserTypeNotStudent') {
    throw new EduConnectError(EduConnectErrorMessageEnum.UserTypeNotStudent)
  } else if (params?.code === 'DuplicateUser' || params?.code === 'DuplicateINE') {
    throw new EduConnectError(EduConnectErrorMessageEnum.DuplicateUser)
  } else {
    throw new Error(EduConnectErrorMessageEnum.UnknownErrorCode)
  }
})
