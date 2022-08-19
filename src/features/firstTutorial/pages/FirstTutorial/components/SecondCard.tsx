import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { useDepositAmountsByAge } from 'features/auth/api'
import TutorialOffers from 'ui/animations/tutorial_offers.json'
import {
  AchievementCardKeyProps,
  GenericAchievementCard,
} from 'ui/components/achievements/components/GenericAchievementCard'
import { SlantTag } from 'ui/components/SlantTag'
import { Spacer } from 'ui/components/spacer/Spacer'
import { getSpacing, Typo } from 'ui/theme'

const tagWidth = getSpacing(10.75)
const tagHeight = getSpacing(5)

export function SecondCard(props: AchievementCardKeyProps) {
  const depositAmountsByAge = useDepositAmountsByAge()

  const centerChild = () => (
    <React.Fragment>
      <StyledPricesContainer>
        <Spacer.Flex flex={0.5} />
        <TagAndSubtitleContainer>
          <SlantTag
            text={depositAmountsByAge.fifteenYearsOldDeposit.replace(' ', '')}
            testID="Aide financière 15 ans"
            width={tagWidth}
            height={tagHeight}
          />
          <Spacer.Column numberOfSpaces={1} />
          <StyledCaption>15 ans</StyledCaption>
        </TagAndSubtitleContainer>
        <Spacer.Flex flex={0.25} />
        <TagAndSubtitleContainer>
          <SlantTag
            text={depositAmountsByAge.sixteenYearsOldDeposit.replace(' ', '')}
            testID="Aide financière 16 ans"
            width={tagWidth}
            height={tagHeight}
          />
          <Spacer.Column numberOfSpaces={1} />
          <StyledCaption>16 ans</StyledCaption>
        </TagAndSubtitleContainer>
        <Spacer.Flex flex={0.25} />
        <TagAndSubtitleContainer>
          <SlantTag
            text={depositAmountsByAge.seventeenYearsOldDeposit.replace(' ', '')}
            testID="Aide financière 17 ans"
            width={tagWidth}
            height={tagHeight}
          />
          <Spacer.Column numberOfSpaces={1} />
          <StyledCaption>17 ans</StyledCaption>
        </TagAndSubtitleContainer>
        <Spacer.Flex flex={0.25} />
        <TagAndSubtitleContainer>
          <SlantTag
            text={depositAmountsByAge.eighteenYearsOldDeposit.replace(' ', '')}
            testID={t`Aide financière 18 ans`}
            width={tagWidth}
            height={tagHeight}
          />
          <Spacer.Column numberOfSpaces={1} />
          <StyledCaption>18 ans</StyledCaption>
        </TagAndSubtitleContainer>
        <Spacer.Flex flex={0.5} />
      </StyledPricesContainer>
    </React.Fragment>
  )

  function onButtonPress() {
    props.swiperRef?.current?.goToNext()
  }

  const nextStep = (props.activeIndex || 0) + 2
  const totalSteps = (props.lastIndex || 3) + 1

  return (
    <GenericAchievementCard
      animation={TutorialOffers}
      buttonCallback={onButtonPress}
      buttonText="Continuer"
      buttonAccessibilityLabel={`Continuer vers l'étape ${nextStep} sur ${totalSteps}`}
      pauseAnimationOnRenderAtFrame={62}
      title="Des offres pour tous"
      subTitle="et si tu as..."
      centerChild={centerChild}
      text="de 15 à 18 ans\u00a0: le Gouvernement offre un crédit à dépenser dans l’application."
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
    />
  )
}

const StyledPricesContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
})

const TagAndSubtitleContainer = styled.View({
  flexDirection: 'column',
})

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.black,
  alignSelf: 'center',
}))
