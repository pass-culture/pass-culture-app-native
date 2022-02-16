import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { Typo } from 'ui/theme'

export const BookingNotFound = ({ resetErrorBoundary }: ScreenErrorProps) => {
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
    navigate('EndedBookings')

    // TODO(antoinewg/kopax): check if this can be removed. https://github.com/tannerlinsley/react-query/releases/tag/v3.32.3
    // if we reset too fast, it will rerun the failed query, this as no effect on the UI but that's not desired.
    const beforeResetDelayInMs = 300
    timer.current = globalThis.setTimeout(resetErrorBoundary, beforeResetDelayInMs)
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{t`Réservation introuvable | pass Culture`}</title>
      </Helmet>
      <GenericInfoPage
        title={t`Réservation introuvable\u00a0!`}
        icon={NoBookings}
        buttons={[
          <ButtonPrimaryWhite key={1} wording={t`Mes réservations terminées`} onPress={onPress} />,
          <ButtonTertiaryWhite
            key={2}
            wording={t`Retourner à l'accueil`}
            onPress={navigateToHome}
          />,
        ]}>
        <StyledBody>{t`Désolé, nous ne retrouvons pas ta réservation. Peut-être a-t-elle été annulée. N'hésite pas à retrouver la liste de tes réservations terminées et annulées pour t'en assurer.`}</StyledBody>
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
