import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import { styled } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import {
  setFeedbackInAppSchema,
  FEEDBACK_IN_APP_VALUE_MAX_LENGTH,
} from 'features/profile/pages/FeedbackInApp/setFeedbackInAppShema'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { useCopyToClipboard } from 'libs/useCopyToClipboard/useCopyToClipboard'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { LargeTextInput } from 'ui/components/inputs/LargeTextInput/LargeTextInput'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useVersion } from 'ui/hooks/useVersion'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Typo, getSpacing } from 'ui/theme'
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
    getValues,
  } = useForm<FormValue>({
    defaultValues: { feedback: '' },
    resolver: yupResolver(setFeedbackInAppSchema),
    mode: 'onChange',
  })

  const undefinedValue = 'Non renseigné'
  const description = getValues().feedback.toString()
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

  return (
    <PageWithHeader
      title="Débuggage"
      scrollChildren={
        <ViewGap gap={2}>
          {sortedDebugData.map((item) => (
            <Typo.Button key={item.label}>
              {item.label}&nbsp;: <Typo.Body>{item.value}</Typo.Body>
            </Typo.Button>
          ))}
          <InputContainer>
            <Controller
              control={control}
              name="feedback"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <LargeTextInput
                  label="Description"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Décrire en quelques phrases."
                  isError={!!error && value.length > FEEDBACK_IN_APP_VALUE_MAX_LENGTH}
                  isRequiredField
                  showErrorMessage={!!error && value.length > FEEDBACK_IN_APP_VALUE_MAX_LENGTH}
                />
              )}
            />
          </InputContainer>
        </ViewGap>
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          <ButtonPrimary wording="Copier dans le presse-papier" onPress={copyToClipboard} />
          <ExternalTouchableLink
            disabled={!isValid}
            as={ButtonSecondary}
            wording="Contacter le support"
            externalNav={{ url: mailtoUrl }}
            icon={EmailFilled}
            onBeforeNavigate={() => analytics.logClickMailDebugInfo(user?.id)}
          />
        </ViewGap>
      }
    />
  )
}

const InputContainer = styled.View({
  marginVertical: getSpacing(1),
})
