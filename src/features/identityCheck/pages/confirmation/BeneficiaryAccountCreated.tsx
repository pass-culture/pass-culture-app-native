import React, { useCallback } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import {
  shouldShowCulturalSurvey,
  useCulturalSurveyRoute,
} from 'features/culturalSurvey/helpers/utils'
import { navigateToHome, navigateToHomeConfig } from 'features/navigation/helpers'
import { isUserUnderageBeneficiary } from 'features/profile/helpers/isUserUnderageBeneficiary'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { formatPriceInEuroToDisplayPrice } from 'libs/parsers'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import TutorialPassLogo from 'ui/animations/tutorial_pass_logo.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { useEnterKeyAction } from 'ui/hooks/useEnterKeyAction'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { categoriesIcons } from 'ui/svg/icons/bicolor/exports/categoriesIcons'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export function BeneficiaryAccountCreated() {
  const maxPrice = useMaxPrice()
  const { uniqueColors } = useTheme()
  const { user } = useAuthContext()
  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const culturalSurveyRoute = useCulturalSurveyRoute()
  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)
  const { showShareAppModal } = useShareAppContext()

  const subtitle = `${maxPrice}\u00a0€ viennent d'être crédités sur ton compte pass Culture`
  const text = isUnderageBeneficiary
    ? 'Tu as jusqu’à la veille de tes 18 ans pour profiter de ton budget.'
    : 'Tu as deux ans pour profiter de ton budget.'

  const onBeforeNavigate = useCallback(() => {
    BatchUser.trackEvent(BatchEvent.hasValidatedSubscription)
    showShareAppModal(ShareAppModalType.BENEFICIARY)
  }, [showShareAppModal])

  useEnterKeyAction(navigateToHome)

  return (
    <GenericInfoPageWhite animation={TutorialPassLogo} title="Bonne nouvelle&nbsp;!">
      <StyledSubtitle>{subtitle}</StyledSubtitle>

      <Spacer.Column numberOfSpaces={4} />
      <ProgressBarContainer>
        <AnimatedProgressBar
          progress={1}
          color={uniqueColors.brand}
          icon={categoriesIcons.Show}
          isAnimated
        />
        <Amount>{formatPriceInEuroToDisplayPrice(maxPrice)}</Amount>
      </ProgressBarContainer>
      <Spacer.Column numberOfSpaces={4} />
      <StyledBody>{text}</StyledBody>
      <Spacer.Column numberOfSpaces={5} />
      <ButtonContainer>
        <InternalTouchableLink
          as={ButtonPrimary}
          wording="C’est parti&nbsp;!"
          navigateTo={
            shouldNavigateToCulturalSurvey ? { screen: culturalSurveyRoute } : navigateToHomeConfig
          }
          onBeforeNavigate={onBeforeNavigate}
        />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}

const StyledSubtitle = styled(Typo.Title4).attrs(getNoHeadingAttrs())({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})

const ProgressBarContainer = styled.View({
  paddingHorizontal: getSpacing(10),
})

const Amount = styled(Typo.Title2).attrs(getNoHeadingAttrs())(({ theme }) => ({
  textAlign: 'center',
  color: theme.uniqueColors.brand,
}))

const ButtonContainer = styled.View({
  alignItems: 'center',
})
