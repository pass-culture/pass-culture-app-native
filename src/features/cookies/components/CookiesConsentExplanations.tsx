import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export const CookiesConsentExplanations = () => (
  <StyledView>
    <Typo.Body>
      Les cookies sont des petits fichiers stockés sur ton appareil lorsque tu navigues. Nous
      utilisons les données collectées par ces cookies et traceurs pour t’offrir la meilleure
      expérience possible.
    </Typo.Body>
    <Typo.Body>
      Tu peux accéder aux réglages des cookies pour faire un choix éclairé et découvrir notre
      politique de gestion des cookies.
    </Typo.Body>
    <StyledBodyAccentXs>
      Ton choix est conservé pendant 6 mois et tu pourras le modifier dans les paramètres de
      confidentialité de ton profil à tout moment.
    </StyledBodyAccentXs>
  </StyledView>
)

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledView = styled.View(({ theme }) => ({
  gap: theme.designSystem.size.spacing.l,
  paddingBottom: theme.designSystem.size.spacing.l,
}))
