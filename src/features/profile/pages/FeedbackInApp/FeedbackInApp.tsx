import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import { PageWithHeader } from 'features/identityCheck/components/layout/PageWithHeader'
import { setFeedbackInAppSchema } from 'features/profile/pages/FeedbackInApp/setFeedbackInAppShema'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { LargeTextInput } from 'ui/components/inputs/LargeTextInput/LargeTextInput'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { BicolorRequestSent } from 'ui/svg/icons/BicolorRequestSent'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const FEEDBACK_IN_APP_VALUE_MAX_LENGTH = 800

export const FeedbackInApp = () => {
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm({
    defaultValues: { feedback: '' },
    resolver: yupResolver(setFeedbackInAppSchema),
    mode: 'onChange',
  })

  const onSubmit = () => 'doNothing'

  return (
    <PageWithHeader
      title="Faire une suggestion"
      scrollChildren={
        <React.Fragment>
          <IllustrationContainer>
            <StyledIllustration />
          </IllustrationContainer>
          <Spacer.Column numberOfSpaces={5} />
          <Typo.Title3 {...getHeadingAttrs(1)}>
            Comment pourrions-nous améliorer l’application&nbsp;?
          </Typo.Title3>
          <Spacer.Column numberOfSpaces={5} />
          <Typo.Body>
            Nous ne pouvons pas te répondre individuellement mais ta suggestion sera transmise à nos
            équipes.
          </Typo.Body>
          <Spacer.Column numberOfSpaces={5} />
          <Typo.Body>
            Si tu as une question ou besoin d’aide nous t’invitons à
            <Spacer.Row numberOfSpaces={1} />
            <ExternalTouchableLink
              as={StyledButtonInsideText}
              wording="contacter le support"
              accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
              icon={EmailFilled}
              externalNav={contactSupport.forGenericQuestion}
            />
          </Typo.Body>
          <Spacer.Column numberOfSpaces={10} />
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
          <ButtonContainer>
            <ButtonPrimary
              type="submit"
              wording="Envoyer ma suggestion"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid}
            />
          </ButtonContainer>
          <Spacer.BottomScreen />
        </React.Fragment>
      }
    />
  )
}

const IllustrationContainer = styled.View({
  justifyContent: 'center',
  flexDirection: 'row',
})

const StyledIllustration = styled(BicolorRequestSent).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
}))``

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.colors.black,
}))``

const ButtonContainer = styled.View({ paddingVertical: getSpacing(5) })
