import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import FrenchRepublicAnimation from 'ui/animations/french_republic_animation.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { categoriesIcons } from 'ui/svg/icons/exports/categoriesIcons'
import { Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export function BonificationGranted() {
  const { designSystem } = useTheme()

  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const bonificationAmount = formatCurrencyFromCents(5000, currency, euroToPacificFrancRate) // get amount from backend

  return (
    <GenericInfoPage
      animation={FrenchRepublicAnimation}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
      animationTargetLayerNames={['étoile', 'cadre']}
      title="Bonne nouvelle&nbsp;!"
      buttonPrimary={{ wording: 'J’en profite', navigateTo: navigateToHomeConfig }}>
      <React.Fragment>
        <StyledBody>
          {bonificationAmount} ont été ajoutés à ton crédit pour explorer la culture.
        </StyledBody>
        <ProgressBarContainer>
          <AnimatedProgressBar
            progress={1}
            color={designSystem.color.background.brandPrimary}
            icon={categoriesIcons.Show}
            isAnimated
          />
          <Amount>{bonificationAmount}</Amount>
        </ProgressBarContainer>
        <StyledBody>
          Ton dossier est validé&nbsp;! Tu fais partie des jeunes qui bénéficient d’une aide.
        </StyledBody>
      </React.Fragment>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.l,
}))

const ProgressBarContainer = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xxxl,
}))

const Amount = styled(Typo.Title2).attrs(getNoHeadingAttrs())(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.brandPrimary,
}))
