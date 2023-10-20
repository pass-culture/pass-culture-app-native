import React from 'react'
import styled from 'styled-components/native'

import { CreditComponentProps } from 'features/tutorial/components/CreditTimeline'
import { InformationStepContent } from 'features/tutorial/components/profileTutorial/InformationStepContent'
import { Warning } from 'ui/svg/icons/BicolorWarning'
import { Offers } from 'ui/svg/icons/Offers'
import { Spacer } from 'ui/theme'

const GreyOffers = styled(Offers).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
}))``

const GreyWarning = styled(Warning).attrs(({ theme }) => ({
  color: theme.colors.greySemiDark,
  color2: theme.colors.greySemiDark,
  color3: theme.colors.greySemiDark,
}))``

export const eighteenSeparatorStep: CreditComponentProps = {
  creditStep: 'information',
  iconComponent: <GreyWarning />,
  children: (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <InformationStepContent title="La veille de tes 18 ans" subtitle="Ton crédit est remis à 0" />
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  ),
}

export const lastStep: CreditComponentProps = {
  creditStep: 'information',
  iconComponent: <GreyOffers />,
  children: (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <InformationStepContent
        title="Au bout de 2 ans, ton crédit expire… Mais l’aventure continue&nbsp;!"
        subtitle="Tu peux continuer à réserver des offres gratuites autour de chez toi."
      />
    </React.Fragment>
  ),
}
