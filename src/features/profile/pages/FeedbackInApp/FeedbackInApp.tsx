import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/helpers/contactSupport'
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
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type FormValue = {
  feedback: string
}

export const FeedbackInApp = () => {
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<FormValue>({
    defaultValues: { feedback: '' },
    resolver: yupResolver(setFeedbackInAppSchema),
    mode: 'onChange',
  })

  const { mutate: sendFeedback } = useFeedbackMutation()

  const onSubmit = ({ feedback }: FormValue) => {
    sendFeedback({ feedback })
  }

  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  return (
    <PageWithHeader
      title="Faire une suggestion"
      onGoBack={goBack}
      scrollChildren={
        <React.Fragment>
          <Typo.Title3 {...getHeadingAttrs(1)}>
            Comment pourrions-nous améliorer l’application&nbsp;?
          </Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <Typo.Body>
            Nous ne pouvons pas te répondre individuellement mais ta suggestion sera transmise à nos
            équipes.
          </Typo.Body>
          <Spacer.Column numberOfSpaces={6} />
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
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            type="submit"
            wording="Envoyer ma suggestion"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          />
          <Spacer.Column numberOfSpaces={4} />
          <StyledSeparatorWithText label="ou" />
          <Spacer.Column numberOfSpaces={4} />
          <StyledBody>Si tu as besoin d’aide, notre support est toujours accessible.</StyledBody>
          <Spacer.Column numberOfSpaces={4} />
          <ExternalTouchableLink
            as={ButtonTertiaryBlack}
            wording="contacter le support"
            accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
            icon={EmailFilled}
            externalNav={contactSupport.forGenericQuestion}
          />
          <Spacer.Column numberOfSpaces={5} />
          <Spacer.BottomScreen />
        </React.Fragment>
      }
    />
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const StyledSeparatorWithText = styled(SeparatorWithText).attrs(({ theme }) => ({
  backgroundColor: theme.colors.greyMedium,
}))``
