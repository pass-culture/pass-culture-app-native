import React from 'react'

import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
import { Spacer, Typo } from 'ui/theme'

export const CookiesConsentExplanations = () => (
  <React.Fragment>
    <Typo.Body>
      Les cookies sont des petits fichiers stockés sur ton appareil lorsque tu navigues. Nous
      utilisons les données collectées par ces cookies et traceurs pour t’offrir la meilleure
      expérience possible.
    </Typo.Body>
    <Spacer.Column numberOfSpaces={4} />
    <Typo.Body>
      Tu peux accéder aux réglages des cookies pour faire un choix éclairé et découvrir notre
      politique de gestion des cookies.
    </Typo.Body>
    <Spacer.Column numberOfSpaces={4} />
    <GreyDarkCaption>
      Ton choix est conservé pendant 6 mois et tu pourras le modifier dans les paramètres de
      confidentialité de ton profil à tout moment.
    </GreyDarkCaption>
    <Spacer.Column numberOfSpaces={4} />
  </React.Fragment>
)
