import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { ComponentType } from 'react'
import { FallbackProps, withErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components/native'

import { homeNavigateConfig } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { OfferNotFoundError } from 'libs/errorMonitoring'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { ColorsEnum, Spacer, Typo, getSpacing } from 'ui/theme'

export const OfferNotFoundErrorFallback = (props: FallbackProps) => {
  const navigation = useNavigation<UseNavigationType>()

  // Error bubbling : wrap `withOfferNotFoundErrorBoundary` with another boundary
  // to handle errors that are not `OfferNotFoundError`
  if (!(props.error instanceof OfferNotFoundError)) {
    throw props.error
  }

  function onPress() {
    props.resetErrorBoundary()
    navigation.replace(homeNavigateConfig.screen, homeNavigateConfig.params)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withOfferNotFoundErrorBoundary(component: ComponentType<any>) {
  return withErrorBoundary(React.memo(component), {
    FallbackComponent: OfferNotFoundErrorFallback,
  })
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
