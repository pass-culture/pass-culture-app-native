import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AdviceCardList } from 'features/advices/components/AdviceCardList/AdviceCardList'
import { ADVICE_CARD_WIDTH } from 'features/advices/constants'
import { ClubAdviceSectionProps } from 'features/offer/components/OfferContent/ClubAdviceSection/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ClubAdviceSectionBase = ({
  data,
  variantInfo,
  ctaLabel,
  navigateTo,
  onBeforeNavigate,
  onSeeMoreButtonPress,
  onShowClubAdviceWritersModal,
  style,
}: ClubAdviceSectionProps) => {
  const shouldDisplayAllAdvicesButton = data.length > 1

  return (
    <View style={style}>
      <Gutter>
        <Typo.Title3 {...getHeadingAttrs(3)}>{variantInfo.titleSection}</Typo.Title3>
        {variantInfo.subtitleSection ? (
          <StyledBodyAccentXs>{variantInfo.subtitleSection}</StyledBodyAccentXs>
        ) : null}
      </Gutter>
      <StyledChronicleCardlist
        data={data}
        onSeeMoreButtonPress={onSeeMoreButtonPress}
        shouldTruncate
        cardIcon={variantInfo.Icon}
        tag={variantInfo.tag}
      />
      {shouldDisplayAllAdvicesButton ? (
        <Gutter>
          <InternalTouchableLink
            as={Button}
            wording={ctaLabel}
            navigateTo={navigateTo}
            onBeforeNavigate={onBeforeNavigate}
            variant="secondary"
            color="neutral"
            size="small"
          />
        </Gutter>
      ) : null}
      <Gutter>
        <ClubButtonContainer withMarginTop={shouldDisplayAllAdvicesButton}>
          <Button
            wording={variantInfo.modalTitle}
            icon={InfoPlain}
            onPress={onShowClubAdviceWritersModal}
            variant="tertiary"
            color="neutral"
            size="small"
          />
        </ClubButtonContainer>
      </Gutter>
    </View>
  )
}

const StyledChronicleCardlist = styled(AdviceCardList).attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginHorizontal,
  },
  cardWidth: ADVICE_CARD_WIDTH,
  snapToInterval: ADVICE_CARD_WIDTH,
}))``

const Gutter = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const ClubButtonContainer = styled.View<{ withMarginTop: boolean }>(({ theme, withMarginTop }) => ({
  marginTop: withMarginTop ? theme.designSystem.size.spacing.l : undefined,
}))
