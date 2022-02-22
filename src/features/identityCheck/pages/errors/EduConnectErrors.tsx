import { useRoute } from '@react-navigation/native'

import { withEduConnectErrorBoundary } from 'features/identityCheck/errors/eduConnect/EduConnectErrorBoundary'
import { EduConnectError } from 'features/identityCheck/errors/eduConnect/types'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/errors/hooks/useNotEligibleEduConnectErrorData'
import { logoutFromEduConnectIfAllowed } from 'features/identityCheck/utils/logoutFromEduConnectIfAllowed'
import { UseRouteType } from 'features/navigation/RootNavigator'

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
  } else {
    throw new EduConnectError(EduConnectErrorMessageEnum.GenericError)
  }
})
