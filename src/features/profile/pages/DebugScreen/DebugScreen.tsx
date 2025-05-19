import React from 'react'
import { Platform } from 'react-native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { env } from 'libs/environment/env'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useVersion } from 'ui/hooks/useVersion'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK, LINE_BREAK } from 'ui/theme/constants'

const isWeb = Platform.OS === 'web'

export const DebugScreen = () => {
  const deviceInfo = useDeviceInfo()
  const { user } = useAuthContext()
  const version = useVersion()
  const webCommitHash = isWeb ? `-${String(env.COMMIT_HASH)}` : ''
  const fullVersion = `${version}${webCommitHash}`
  const zoomInPercent = deviceInfo?.screenZoomLevel
    ? `${Math.round(deviceInfo.screenZoomLevel * 100)}%`
    : undefined

  const debugData = [
    { label: 'App version', value: fullVersion },
    { label: 'Device ID', value: deviceInfo?.deviceId },
    { label: 'Device model', value: deviceInfo?.source },
    { label: 'Device OS', value: deviceInfo?.os },
    { label: 'Device resolution', value: deviceInfo?.resolution },
    { label: 'Device zoom', value: zoomInPercent },
    { label: 'User ID', value: user?.id },
  ]

  const sortedDebugData = [...debugData].sort((a, b) => a.label.localeCompare(b.label))

  const debugText = sortedDebugData
    .map((item) => `${item.label}\u00a0: ${item.value ?? 'undefined'}`)
    .join(LINE_BREAK)
    .toString()

  const copyToClipboard = useCopyToClipboard({
    textToCopy: debugText,
    snackBarMessage: 'Copié dans le presse-papier\u00a0!',
  })

  const subject = encodeURI(`Informations de débuggage\u00a0: ${String(user?.id)}`)
  const body = encodeURI(
    `Bonjour, voici les informations de débuggage\u00a0:${DOUBLE_LINE_BREAK}${debugText}`
  )
  const mailtoUrl = `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=${subject}&body=${body}`

  return (
    <PageWithHeader
      title="Débuggage"
      scrollChildren={
        <ViewGap gap={2}>
          {sortedDebugData.map((item, index) => (
            <Typo.Button key={index}>
              {item.label}&nbsp;: <Typo.Body>{item.value}</Typo.Body>
            </Typo.Button>
          ))}
        </ViewGap>
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          <ButtonPrimary wording="Copier dans le presse-papier" onPress={copyToClipboard} />
          <ExternalTouchableLink
            as={ButtonSecondary}
            wording="Contacter le support"
            externalNav={{ url: mailtoUrl }}
            icon={EmailFilled}
          />
        </ViewGap>
      }
    />
  )
}
