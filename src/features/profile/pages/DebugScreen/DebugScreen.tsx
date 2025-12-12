import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Platform, TextStyle, View } from 'react-native'
import { styled } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { setFeedbackInAppSchema } from 'features/profile/pages/FeedbackInApp/setFeedbackInAppShema'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { LargeTextInput } from 'ui/components/inputs/LargeTextInput/LargeTextInput'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { useVersion } from 'ui/hooks/useVersion'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Duplicate } from 'ui/svg/icons/Duplicate'
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

  type FormValue = {
    feedback: string
  }

  const {
    control,
    formState: { isValid },
    watch,
  } = useForm<FormValue>({
    defaultValues: { feedback: '' },
    resolver: yupResolver(setFeedbackInAppSchema),
    mode: 'onChange',
  })

  const undefinedValue = 'Non renseigné'
  const description = watch().feedback.toString()
  const debugData = [
    { label: 'App version', value: fullVersion },
    { label: 'Device ID', value: deviceInfo?.deviceId ?? undefinedValue },
    { label: 'Device model', value: deviceInfo?.source ?? undefinedValue },
    { label: 'Device OS', value: deviceInfo?.os ?? undefinedValue },
    { label: 'Device resolution', value: deviceInfo?.resolution ?? undefinedValue },
    { label: 'Device zoom', value: zoomInPercent ?? undefinedValue },
    { label: 'User ID', value: user?.id ?? undefinedValue },
    { label: 'Device font scale', value: deviceInfo?.fontScale ?? undefinedValue },
    { label: 'Description', value: description ?? undefinedValue },
  ]

  const sortedDebugData = [...debugData].sort((a, b) => a.label.localeCompare(b.label))

  const debugText = sortedDebugData
    .map((item) => `${item.label}\u00a0: ${String(item.value)}`)
    .join(LINE_BREAK)

  const copyToClipboard = useCopyToClipboard({
    textToCopy: debugText,
    snackBarMessage: 'Copié dans le presse-papier\u00a0!',
    onCopy: () => analytics.logClickCopyDebugInfo(user?.id),
  })

  const subject = encodeURI(`Informations de débuggage\u00a0: ${String(user?.id)}`)
  const body = encodeURI(
    `Bonjour, voici les informations de débuggage\u00a0:${DOUBLE_LINE_BREAK}${debugText}`
  )
  const mailtoUrl = `mailto:${env.SUPPORT_EMAIL_ADDRESS}?subject=${subject}&body=${body}`

  const labelBoldStyle: TextStyle = { fontWeight: 'bold' }
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
            <ClipboardButton
              accessibilityRole={AccessibilityRole.BUTTON}
              accessibilityLabel="Copier dans le presse-papier"
              onPress={copyToClipboard}>
              <StyledDuplicate />
            </ClipboardButton>
          </View>
          <Banner
            type={BannerType.DEFAULT}
            label="Pour tous les problèmes liés à ton crédit ou ton compte, contacte-nous via le formulaire"
            externalNav={{ url: env.SUPPORT_ACCOUNT_ISSUES_FORM }}
            links={[
              {
                externalNav: { url: env.SUPPORT_ACCOUNT_ISSUES_FORM },
                wording: 'Contacter le support',
              },
            ]}
            onBeforeNavigate={() => analytics.logHasClickedContactForm('DebugScreen')}
          />
          <Controller
            control={control}
            name="feedback"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
              return (
                <LargeTextInput
                  label="Description du problème"
                  labelStyle={labelBoldStyle}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  errorMessage={error?.message}
                  testID="problem-description-input"
                  requiredIndicator="explicit"
                />
              )
            }}
          />
        </ViewGap>
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          <ExternalTouchableLink
            disabled={!isValid}
            as={ButtonSecondary}
            wording="Envoyer mon bug au support"
            externalNav={{ url: mailtoUrl }}
            icon={EmailFilled}
            onBeforeNavigate={() => analytics.logClickMailDebugInfo(user?.id)}
          />
        </ViewGap>
      }
    />
  )
}

const StyledDuplicate = styled(Duplicate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const ClipboardButton = styled.TouchableOpacity(({ theme }) => {
  return {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.designSystem.size.spacing.m,
    borderColor: theme.designSystem.color.background.brandPrimary,
    borderWidth: 1,
    borderRadius: theme.designSystem.size.borderRadius.m,
  }
})
