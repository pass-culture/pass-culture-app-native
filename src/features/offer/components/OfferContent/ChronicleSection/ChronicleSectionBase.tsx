import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { ChronicleSectionProps } from './types'

export const ChronicleSectionBase = ({
  data,
  variantInfo,
  ctaLabel,
  navigateTo,
  onBeforeNavigate,
  onSeeMoreButtonPress,
  onShowChroniclesWritersModal,
  style,
}: ChronicleSectionProps) => {
  const shouldDisplayAllReviewsButton = data.length > 1

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
      />
      {shouldDisplayAllReviewsButton ? (
        <Gutter>
          <InternalTouchableLink
            as={Button}
            wording={ctaLabel}
            navigateTo={navigateTo}
            onBeforeNavigate={onBeforeNavigate}
            variant="secondary"
            color="neutral"
          />
        </Gutter>
      ) : null}
      <Gutter>
        <ClubButtonContainer withMarginTop={shouldDisplayAllReviewsButton}>
          <Button
            wording={variantInfo.modalTitle}
            icon={InfoPlain}
            onPress={onShowChroniclesWritersModal}
            variant="tertiary"
            color="neutral"
            size="small"
          />
        </ClubButtonContainer>
      </Gutter>
    </View>
  )
}

const StyledChronicleCardlist = styled(ChronicleCardList).attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.contentPage.marginHorizontal,
  },
  cardWidth: CHRONICLE_CARD_WIDTH,
  snapToInterval: CHRONICLE_CARD_WIDTH,
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
