import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import {
  FEEDBACK_IN_APP_VALUE_MAX_LENGTH,
  setFeedbackInAppSchema,
} from 'features/profile/pages/FeedbackInApp/setFeedbackInAppShema'
import { useFeedbackMutation } from 'features/profile/queries/useFeedbackMutation'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { LargeTextInput } from 'ui/components/inputs/LargeTextInput/LargeTextInput'
import { SeparatorWithText } from 'ui/components/SeparatorWithText'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValue = {
  feedback: string
}

export const FeedbackInApp = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const navigateToProfile = () => navigate(...getTabNavConfig('Profile'))
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

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
      showSuccessSnackBar({
        message: 'Ta suggestion a bien été transmise\u00a0!',
        timeout: SNACK_BAR_TIME_OUT,
      })
      navigateToProfile()
    },
    onError: () => {
      showErrorSnackBar({
        message: 'Une erreur s’est produite lors de l’envoi de ta suggestion. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const onSubmit = ({ feedback }: FormValue) => {
    sendFeedback({ feedback })
  }

  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  return (
    <PageWithHeader
      title="Faire une suggestion"
      onGoBack={goBack}
      scrollChildren={
        <ViewGap gap={5}>
          <Typo.Title3 {...getHeadingAttrs(1)}>
            Comment pourrions-nous améliorer l’application&nbsp;?
          </Typo.Title3>
          <Typo.Body>
            Nous ne pouvons pas te répondre individuellement mais ta suggestion sera transmise à nos
            équipes.
          </Typo.Body>
          <InputContainer>
            <Controller
              control={control}
              name="feedback"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <LargeTextInput
                  label="Ma suggestion"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Ma suggestion..."
                  isError={!!error && value.length > FEEDBACK_IN_APP_VALUE_MAX_LENGTH}
                  isRequiredField
                  showErrorMessage={!!error && value.length > FEEDBACK_IN_APP_VALUE_MAX_LENGTH}
                />
              )}
            />
          </InputContainer>
          <ButtonPrimary
            type="submit"
            wording="Envoyer ma suggestion"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          />
          <StyledSeparatorWithText label="ou" />
          <StyledBody>Si tu as besoin d’aide, notre support est toujours accessible.</StyledBody>
          <ExternalTouchableLink
            as={ButtonTertiaryBlack}
            wording="contacter le support"
            accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
            icon={EmailFilled}
            externalNav={contactSupport.forGenericQuestion}
          />
          <Spacer.BottomScreen />
        </ViewGap>
      }
    />
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
const InputContainer = styled.View({
  marginVertical: getSpacing(1),
})

const StyledSeparatorWithText = styled(SeparatorWithText).attrs(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))``
