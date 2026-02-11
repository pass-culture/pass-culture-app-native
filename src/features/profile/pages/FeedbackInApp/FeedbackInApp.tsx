import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { setFeedbackInAppSchema } from 'features/profile/pages/FeedbackInApp/setFeedbackInAppShema'
import { useFeedbackMutation } from 'features/profile/queries/useFeedbackMutation'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { LargeTextInput } from 'ui/components/inputs/LargeTextInput/LargeTextInput'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { Button } from 'ui/designSystem/Button/Button'
import { showSuccessSnackBar, showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValue = {
  feedback: string
}

export const FeedbackInApp = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToProfile = () => navigate(...getTabHookConfig('Profile'))

  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormValue>({
    defaultValues: { feedback: '' },
    resolver: yupResolver(setFeedbackInAppSchema),
    mode: 'onChange',
  })

  const { mutate: sendFeedback } = useFeedbackMutation({
    onSuccess: () => {
      showSuccessSnackBar('Ta suggestion a bien été transmise\u00a0!')

      navigateToProfile()
    },
    onError: () => {
      showErrorSnackBar(
        'Une erreur s’est produite lors de l’envoi de ta suggestion. Réessaie plus tard.'
      )
    },
  })

  const onSubmit = ({ feedback }: FormValue) => {
    sendFeedback({ feedback })
  }

  const { goBack } = useGoBack(...getTabHookConfig('Profile'))

  return (
    <PageWithHeader
      title="Faire une suggestion"
      onGoBack={goBack}
      scrollChildren={
        <StyledViewGap gap={6}>
          <ViewGap gap={4}>
            <Typo.Title3 {...getHeadingAttrs(1)}>
              Comment pourrions-nous améliorer l’application&nbsp;?
            </Typo.Title3>
            <Typo.Body>
              Aide-nous à améliorer ton expérience en partageant tes idées&nbsp;! Nous ne pourrons
              pas répondre à chacun, mais ta suggestion sera bien transmise à nos équipes.
            </Typo.Body>
            <Banner
              label="Pour signaler un bug, un souci avec ton crédit ou ton compte, contacte-nous via notre formulaire."
              links={[
                {
                  icon: ExternalSiteFilled,
                  wording: 'Contacter le support',
                  externalNav: {
                    url: env.SUPPORT_ACCOUNT_ISSUES_FORM,
                  },
                  onBeforeNavigate: () => analytics.logHasClickedContactForm('FeedbackInApp'),
                },
              ]}
            />
          </ViewGap>
          <InputContainer>
            <Controller
              control={control}
              name="feedback"
              render={({ field: { onChange, onBlur, value } }) => (
                <LargeTextInput
                  label="Suggérer une amélioration"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  testID="feedback-input"
                />
              )}
            />
          </InputContainer>
          <Button
            type="submit"
            wording="Envoyer"
            accessibilityLabel="Envoyer ma suggestion"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          />
          <Spacer.BottomScreen />
        </StyledViewGap>
      }
    />
  )
}
const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xs,
}))

const InputContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xs,
}))
