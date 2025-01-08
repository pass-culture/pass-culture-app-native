import React from 'react'

import { Spacer, Typo, TypoDS } from 'ui/theme'

export const CookiesConsentExplanations = () => (
  <React.Fragment>
    <TypoDS.Body>
      Les cookies sont des petits fichiers stockés sur ton appareil lorsque tu navigues. Nous
      utilisons les données collectées par ces cookies et traceurs pour t’offrir la meilleure
      expérience possible.
    </TypoDS.Body>
    <Spacer.Column numberOfSpaces={4} />
    <TypoDS.Body>
      Tu peux accéder aux réglages des cookies pour faire un choix éclairé et découvrir notre
      politique de gestion des cookies.
    </TypoDS.Body>
    <Spacer.Column numberOfSpaces={4} />
    <Typo.CaptionNeutralInfo>
      Ton choix est conservé pendant 6 mois et tu pourras le modifier dans les paramètres de
      confidentialité de ton profil à tout moment.
    </Typo.CaptionNeutralInfo>
    <Spacer.Column numberOfSpaces={4} />
  </React.Fragment>
)
