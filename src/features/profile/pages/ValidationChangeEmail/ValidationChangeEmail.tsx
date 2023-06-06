import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useEmailUpdateStatus } from 'features/profile/helpers/useEmailUpdateStatus'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Spacer, Typo } from 'ui/theme'

export function ValidationChangeEmail() {
  const { data: emailUpdateStatus, isLoading } = useEmailUpdateStatus()
  const { navigate } = useNavigation<UseNavigationType>()

  useEffect(() => {
    if (!isLoading && (!emailUpdateStatus || emailUpdateStatus?.expired)) {
      navigateToHome()
    }
  }, [emailUpdateStatus, isLoading])

  const onValidEmail = useCallback(() => {
    // TODO(yassinL) complete with back-end route
    navigate('TrackEmailChange')
  }, [navigate])

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
