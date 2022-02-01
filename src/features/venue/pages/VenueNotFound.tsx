import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { Typo } from 'ui/theme'

export const VenueNotFound = ({ resetErrorBoundary }: ScreenErrorProps) => {
  const timer = useRef<number>()
  const { navigate } = useNavigation<UseNavigationType>()

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    []
  )

  async function onPress() {
    navigate(...homeNavConfig)

    // if we reset too fast, it will rerun the failed query, this as no effect on the UI but that's not desired.
    const beforeResetDelayInMs = 300
    timer.current = globalThis.setTimeout(resetErrorBoundary, beforeResetDelayInMs)
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{t`Lieu introuvable | pass Culture`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <GenericInfoPage
        title={t`Lieu introuvable\u00a0!`}
        icon={NoOffer}
        buttons={[
          <ButtonPrimaryWhite key={1} wording={t`Retourner à l'accueil`} onPress={onPress} />,
        ]}>
        <StyledBody>{t`Il est possible que ce lieu soit désactivé ou n'existe pas.`}</StyledBody>
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.white,
}))
