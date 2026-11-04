import React, { FunctionComponent, useCallback, useMemo } from 'react'
import styled from 'styled-components/native'

import { AuthenticationButton } from 'features/auth/components/AuthenticationButton/AuthenticationButton'
import { StepperOrigin } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { AppModalWithIllustration } from 'ui/components/modals/AppModalWithIllustration'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { UserFavorite } from 'ui/svg/icons/UserFavorite'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'

type BaseProps = {
  visible: boolean
  dismissModal: () => void
}

type Props = BaseProps &
  (
    | { offerId: number; artistId?: never }
    | { artistId: string; offerId?: never }
    | { offerId?: number; artistId?: string }
  )

export const FavoriteAuthModal: FunctionComponent<Props> = ({
  visible,
  offerId,
  artistId,
  dismissModal,
}) => {
  const authParams = useMemo(
    () => ({
      from: StepperOrigin.FAVORITE,
      ...(offerId ? { offerId } : {}),
      ...(artistId ? { artistId } : {}),
    }),
    [offerId, artistId]
  )

  const closeModal = useCallback(() => {
    if (offerId) {
      void analytics.logQuitFavoriteModalForSignIn(offerId)
    }
    dismissModal()
  }, [dismissModal, offerId])

  const signUp = useCallback(() => {
    if (offerId) {
      void analytics.logSignUpFromOffer(offerId)
      void analytics.logSignUpClicked({ from: 'offer_favorite' })
    }
    dismissModal()
  }, [dismissModal, offerId])

  const signIn = useCallback(() => {
    if (offerId) {
      void analytics.logSignInFromOffer(offerId)
    }
    dismissModal()
  }, [dismissModal, offerId])

  return (
    <AppModalWithIllustration
      visible={visible}
      title={'Identifie-toi pour' + LINE_BREAK + 'retrouver tes favoris'}
      remoteIllustration={{
        url: remoteIllustrationUrls.heartMosaicSmall,
        backgroundColor: 'positive01',
      }}
      Illustration={Illustration}
      hideModal={closeModal}>
      <StyledBody>
        Ton compte te permettra de retrouver tous tes favoris en un clin d’oeil&nbsp;!
      </StyledBody>
      <StyledButtonContainer>
        <InternalTouchableLink
          as={Button}
          wording="Créer un compte"
          navigateTo={{
            screen: 'SignupMethods',
            params: authParams,
          }}
          onBeforeNavigate={signUp}
        />
      </StyledButtonContainer>
      <StyledAuthenticationButton type="login" params={authParams} onAdditionalPress={signIn} />
    </AppModalWithIllustration>
  )
}

const StyledAuthenticationButton = styled(AuthenticationButton).attrs(({ theme }) => ({
  linkColor: theme.designSystem.color.text.brandSecondary,
}))``

const StyledButtonContainer = styled.View(({ theme }) => ({
  width: '100%',
  marginTop: theme.designSystem.size.spacing.xl,
  marginBottom: theme.designSystem.size.spacing.l,
}))

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const Illustration = styled(UserFavorite).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``
