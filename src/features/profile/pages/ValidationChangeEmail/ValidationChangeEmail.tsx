import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { useMutation } from 'react-query'
import styled from 'styled-components/native'

import { api } from 'api/api'
import { ChangeBeneficiaryEmailBody } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useLogoutRoutine } from 'features/auth/helpers/useLogoutRoutine'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, Typo } from 'ui/theme'

export function ValidationChangeEmail() {
  const { data: emailUpdateStatus, isLoading } = useEmailUpdateStatus()
  const { navigate } = useNavigation<UseNavigationType>()
  const { params } = useRoute<UseRouteType<'ValidationChangeEmail'>>()
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const { isLoggedIn } = useAuthContext()
  const signOut = useLogoutRoutine()

  async function onEmailValidationSuccess() {
    if (isLoggedIn) {
      await signOut()
    }
    navigate('TrackEmailChange')
    showSuccessSnackBar({
      message:
        'Ton adresse e-mail est modifiée. Tu peux te reconnecter avec ta nouvelle adresse e-mail.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  function onEmailValidationFailure() {
    navigateToHome()
    showErrorSnackBar({
      message:
        'Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  }

  const { mutate: validateEmail } = useMutation(
    (body: ChangeBeneficiaryEmailBody) => api.putnativev1profilevalidateEmail(body),
    {
      onSuccess: onEmailValidationSuccess,
      onError: onEmailValidationFailure,
    }
  )

  useEffect(() => {
    if (!isLoading && (!emailUpdateStatus || emailUpdateStatus?.expired)) {
      navigateToHome()
    }
  }, [emailUpdateStatus, isLoading])

  const onValidEmail = useCallback(() => {
    validateEmail({
      token: params?.token,
    })
  }, [params?.token, validateEmail])

  return (
    <React.Fragment>
      <GenericInfoPageWhite
        icon={BicolorPhonePending}
        titleComponent={Typo.Title3}
        title="Valides-tu la nouvelle adresse e-mail&nbsp;?"
        separateIconFromTitle={false}
        mobileBottomFlex={0.3}>
        <StyledBody>
          <BoldText>Nouvelle adresse e-mail:</BoldText> {emailUpdateStatus?.newEmail}
        </StyledBody>
        <Spacer.Column numberOfSpaces={40} />
        <ButtonPrimary
          wording="Valider l’adresse e-mail"
          accessibilityLabel="Valider l’adresse e-mail"
          onPress={onValidEmail}
        />
        <Spacer.Column numberOfSpaces={4} />
        <InternalTouchableLink
          as={ButtonTertiaryBlack}
          wording="Fermer"
          navigateTo={navigateToHomeConfig}
          icon={Invalidate}
          disabled={isLoading}
        />
      </GenericInfoPageWhite>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const BoldText = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.bold,
}))
