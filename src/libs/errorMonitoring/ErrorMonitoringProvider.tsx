import * as Sentry from '@sentry/react-native'
import React, { FC, memo, PropsWithChildren, useEffect } from 'react'

import { useUserProfileInfo } from 'features/home/api'
import { errorMonitoring } from 'libs/errorMonitoring/services'

interface Props {
  enabled: boolean
}

export const ErrorMonitoringProvider: FC<PropsWithChildren<Props>> = memo(
  function ErrorMonitoringProvider({ children, enabled }: PropsWithChildren<Props>) {
    const { data: user } = useUserProfileInfo()

    useEffect(() => {
      errorMonitoring.init({ enabled })
    }, [enabled])

    useEffect(() => {
      // Last disconnected user id will be sent to Sentry on purpose until application restart
      if (user) {
        Sentry.configureScope((scope) => {
          scope.setExtra('userId', user.id)
        })
      }
    }, [user])

    return <React.Fragment>{children}</React.Fragment>
  }
)
