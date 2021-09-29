import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { ColorsEnum, Spacer, Typo, getSpacing } from 'ui/theme'

export const OfferNotFound = ({ resetErrorBoundary, retry }: ScreenErrorProps) => {
  async function onPress() {
    // this will navigate back to home, we could have use the useNavigation hook here as the navigation is already loaded,
    // despite the fact that it is rendered outside the NavigationContainer. Instead, we did pass a navigate as retry
    if (retry) {
      retry()
    }

    // if we reset too fast, it will rerun the failed query, this as no effect on the UI but that's not desired.
    const beforeResetDelayInMs = 300
    global.setTimeout(resetErrorBoundary, beforeResetDelayInMs)
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{t`Offre introuvable | Pass Culture`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <GenericInfoPage title={t`Offre introuvable !`} icon={NoOffer} iconSize={getSpacing(40)}>
        <StyledBody>{t`Il est possible que cette offre soit désactivée ou n'existe pas.`}</StyledBody>
        <Spacer.Column numberOfSpaces={12} />
        <ButtonPrimaryWhite title={t`Retourner à l'accueil`} onPress={onPress} />
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
