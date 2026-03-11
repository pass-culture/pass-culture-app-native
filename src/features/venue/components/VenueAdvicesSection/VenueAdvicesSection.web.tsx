import React, { FunctionComponent } from 'react'
import { StyleSheet } from 'react-native'
import { styled, useTheme } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { ChronicleCardData } from 'features/chronicle/type'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { Show } from 'ui/svg/icons/Show'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  venue: VenueResponse
  advicesCardData: ChronicleCardData[]
  nbAdvices: number
  onPressChronicleCardSeeMore?: () => void
}

export const VenueAdvicesSection: FunctionComponent<Props> = ({
  venue,
  advicesCardData,
  nbAdvices,
  onPressChronicleCardSeeMore,
}) => {
  const theme = useTheme()
  const shouldDisplayAllAdvicesButton = advicesCardData.length > 1

  return (
    <React.Fragment>
      {theme.isDesktopViewport ? (
        <Gutter>
          <Row>
            <StyledTitle3 {...getHeadingAttrs(3)} numberOfLines={1}>
              {`Les avis par “${venue.name}”`}
            </StyledTitle3>
            {shouldDisplayAllAdvicesButton ? (
              <SeeAllAdvicesContainerDesktop testID="allAdvicesButtonDesktop">
                <InternalTouchableLink
                  as={Button}
                  icon={Show}
                  wording={`Lire les ${nbAdvices} avis`}
                  // TODO(PC-40227): add pro advices page
                  navigateTo={{ screen: 'Chronicles' }}
                  variant="tertiary"
                  color="neutral"
                />
              </SeeAllAdvicesContainerDesktop>
            ) : null}
          </Row>
        </Gutter>
      ) : (
        <Gutter>
          <Typo.Title3 {...getHeadingAttrs(3)} numberOfLines={1}>
            {`Les avis par “${venue.name}”`}
          </Typo.Title3>
        </Gutter>
      )}
      <StyledChronicleCardlist
        data={advicesCardData}
        shouldTruncate
        onSeeMoreButtonPress={onPressChronicleCardSeeMore}
      />
      {shouldDisplayAllAdvicesButton && !theme.isDesktopViewport ? (
        <Gutter>
          <SeeAllAdvicesContainer testID="allAdvicesButtonMobile">
            <InternalTouchableLink
              as={Button}
              wording={`Lire les ${nbAdvices} avis`}
              // TODO(PC-40227): add pro advices page
              navigateTo={{ screen: 'Chronicles' }}
              variant="secondary"
              color="neutral"
              size="small"
            />
          </SeeAllAdvicesContainer>
        </Gutter>
      ) : null}
    </React.Fragment>
  )
}

const Gutter = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  borderRightWidth: StyleSheet.hairlineWidth,
  borderRightColor: theme.designSystem.color.border.default,
  paddingRight: theme.designSystem.size.spacing.s,
}))

const SeeAllAdvicesContainerDesktop = styled.View(({ theme }) => ({
  width: 'auto',
  borderWidth: 0,
  paddingLeft: theme.designSystem.size.spacing.s,
}))

const StyledChronicleCardlist = styled(ChronicleCardList).attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.designSystem.size.spacing.l,
    paddingBottom: theme.isDesktopViewport ? theme.designSystem.size.spacing.xl : undefined,
  },
  cardWidth: CHRONICLE_CARD_WIDTH,
  snapToInterval: CHRONICLE_CARD_WIDTH,
}))``

const SeeAllAdvicesContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))
