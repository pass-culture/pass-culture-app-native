import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ScreenErrorProps } from 'libs/monitoring/errors'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { NoBookings } from 'ui/svg/icons/NoBookings'
import { Typo } from 'ui/theme'

export const BookingNotFound = ({ resetErrorBoundary }: ScreenErrorProps) => {
  const timer = useRef<number>()

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    []
  )

  async function onPress() {
    // TODO(kopax): check if this can be removed. https://github.com/tannerlinsley/react-query/releases/tag/v3.32.3
    // if we reset too fast, it will rerun the failed query, this as no effect on the UI but that's not desired.
    const beforeResetDelayInMs = 300
    timer.current = globalThis.setTimeout(resetErrorBoundary, beforeResetDelayInMs)
  }

  const title = 'Réservation introuvable | pass Culture'

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <GenericInfoPage
        title="Réservation introuvable&nbsp;!"
        icon={NoBookings}
        buttons={[
          <TouchableLink
            key={1}
            as={ButtonPrimaryWhite}
            wording="Mes réservations terminées"
            navigateTo={{ screen: 'EndedBookings' }}
            onPress={onPress}
            navigateBeforeOnPress
          />,
          <TouchableLink
            key={2}
            as={ButtonTertiaryWhite}
            wording="Retourner à l’accueil"
            navigateTo={navigateToHomeConfig}
          />,
        ]}>
        <StyledBody>
          Désolé, nous ne retrouvons pas ta réservation. Peut-être a-t-elle été annulée. N’hésite
          pas à retrouver la liste de tes réservations terminées et annulées pour t’en assurer.
        </StyledBody>
      </GenericInfoPage>
    </React.Fragment>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
