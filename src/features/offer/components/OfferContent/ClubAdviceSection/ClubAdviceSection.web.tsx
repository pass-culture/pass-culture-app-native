import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AdviceCardList } from 'features/advices/components/AdviceCardList/AdviceCardList'
import { ADVICE_CARD_WIDTH } from 'features/advices/constants'
import { ClubAdviceSectionBase } from 'features/offer/components/OfferContent/ClubAdviceSection/ClubAdviceSectionBase'
import { ClubAdviceSectionProps } from 'features/offer/components/OfferContent/ClubAdviceSection/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Show } from 'ui/svg/icons/Show'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ClubAdviceSection = (props: ClubAdviceSectionProps) => {
  const { isDesktopViewport } = useTheme()
  const {
    data,
    variantInfo,
    ctaLabel,
    navigateTo,
    onBeforeNavigate,
    style,
    onSeeMoreButtonPress,
    onShowClubAdviceWritersModal,
  } = props

  const shouldDisplayAllReviewsButton = data.length > 1

  return (
    <React.Fragment>
      {isDesktopViewport ? (
        <View style={style}>
          <Gutter>
            <Row>
              <StyledTitle3 withBorderRight={shouldDisplayAllReviewsButton} {...getHeadingAttrs(3)}>
                {variantInfo.titleSection}
              </StyledTitle3>
              {shouldDisplayAllReviewsButton ? (
                <SeeAllReviewsContainer>
                  <InternalTouchableLink
                    as={Button}
                    icon={Show}
                    wording={ctaLabel}
                    navigateTo={navigateTo}
                    variant="tertiary"
                    color="neutral"
                    onBeforeNavigate={onBeforeNavigate}
                  />
                </SeeAllReviewsContainer>
              ) : null}
            </Row>
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
          <ClubButtonContainer>
            <Button
              wording={variantInfo.modalTitle}
              icon={InfoPlain}
              onPress={onShowClubAdviceWritersModal}
              variant="tertiary"
              color="neutral"
              size="small"
            />
          </ClubButtonContainer>
        </View>
      ) : (
        <ClubAdviceSectionBase {...props} />
      )}
    </React.Fragment>
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

const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })

const StyledTitle3 = styled(Typo.Title3)<{ withBorderRight: boolean }>(
  ({ theme, withBorderRight }) => ({
    ...(withBorderRight
      ? {
          borderRightWidth: StyleSheet.hairlineWidth,
          borderRightColor: theme.designSystem.color.border.default,
          paddingRight: theme.designSystem.size.spacing.s,
        }
      : undefined),
  })
)

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const SeeAllReviewsContainer = styled.View(({ theme }) => ({
  width: 'auto',
  borderWidth: 0,
  paddingLeft: theme.designSystem.size.spacing.s,
}))

const ClubButtonContainer = styled.View(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.xl,
  alignSelf: 'flex-start',
}))
