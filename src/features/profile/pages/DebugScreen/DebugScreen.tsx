import React from 'react'
import { Platform, View } from 'react-native'
import { styled } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { buildZendeskUrlForDebug } from 'features/profile/helpers/buildZendeskUrl'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { copyToClipboard } from 'libs/copyToClipboard/copyToClipboard'
import { env } from 'libs/environment/env'
import { useZoomInPercent } from 'shared/accessibility/helpers/zoomHelpers'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { Button } from 'ui/designSystem/Button/Button'
import { useVersion } from 'ui/hooks/useVersion'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Duplicate } from 'ui/svg/icons/Duplicate'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

const isWeb = Platform.OS === 'web'

export const DebugScreen = () => {
  const deviceInfo = useDeviceInfo()
  const { user } = useAuthContext()
  const version = useVersion()
  const webCommitHash = isWeb ? `-${String(env.COMMIT_HASH)}` : ''
  const fullVersion = `${version}${webCommitHash}`

  const deviceZoom = useZoomInPercent()

  const undefinedValue = 'Non renseigné'
  const debugData = [
    { label: 'App version', value: fullVersion },
    { label: 'Device ID', value: deviceInfo?.deviceId ?? undefinedValue },
    { label: 'Device model', value: deviceInfo?.source ?? undefinedValue },
    { label: 'Device OS', value: deviceInfo?.os ?? undefinedValue },
    { label: 'Device resolution', value: deviceInfo?.resolution ?? undefinedValue },
    { label: 'Device zoom', value: deviceZoom ? `${deviceZoom}%` : undefinedValue },
    { label: 'User ID', value: user?.id ?? undefinedValue },
    { label: 'Device font scale', value: deviceInfo?.fontScale ?? undefinedValue },
    { label: 'User CreditType', value: user?.creditType ?? undefinedValue },
    { label: 'User StatusType', value: user?.statusType ?? undefinedValue },
    { label: 'User EligibilityType', value: user?.eligibilityType ?? undefinedValue },
  ]

  const sortedDebugData = [...debugData].sort((a, b) => a.label.localeCompare(b.label))

  const debugText = sortedDebugData
    .map((item) => `${item.label}\u00a0: ${String(item.value)}`)
    .join(LINE_BREAK)

  const url = buildZendeskUrlForDebug({ user, deviceInfo, version })

  const copy = () =>
    copyToClipboard({
      textToCopy: debugText,
      snackBarMessage: 'Copié dans le presse-papier\u00a0!',
      onCopy: () => analytics.logClickCopyDebugInfo(user?.id),
    })

  const debugDataToShow = sortedDebugData.filter((data) => data.label !== 'Description')
  return (
    <PageWithHeader
      title="Débuggage"
      scrollChildren={
        <ViewGap gap={4}>
          <Typo.Title2>Tu rencontres un souci avec l’application&nbsp;?</Typo.Title2>
          <View>
            {debugDataToShow.map((item) => (
              <Typo.Button key={item.label}>
                {item.label}&nbsp;: <Typo.Body>{item.value}</Typo.Body>
              </Typo.Button>
            ))}
            <ClipboardButtonContainer>
              <Button
                variant="secondary"
                iconButton
                icon={StyledDuplicate}
                accessibilityRole={AccessibilityRole.BUTTON}
                accessibilityLabel="Copier dans le presse-papier"
                onPress={copy}
              />
            </ClipboardButtonContainer>
          </View>
          <Banner
            type={BannerType.DEFAULT}
            label="Pour tous les problèmes liés à ton crédit ou ton compte, contacte-nous via le formulaire"
            externalNav={{ url: env.SUPPORT_ACCOUNT_ISSUES_FORM }}
            links={[
              {
                externalNav: { url },
                wording: 'Contacter le support',
                onBeforeNavigate: () => analytics.logHasClickedContactForm('DebugScreen'),
              },
            ]}
          />
        </ViewGap>
      }
    />
  )
}

const StyledDuplicate = styled(Duplicate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const ClipboardButtonContainer = styled.View({
  position: 'absolute',
  top: 0,
  right: 0,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
})
