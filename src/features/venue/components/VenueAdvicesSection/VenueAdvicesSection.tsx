import React, { FunctionComponent } from 'react'
import { styled } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { ChronicleCardData } from 'features/chronicle/type'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
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
  const shouldDisplayAllAdvicesButton = advicesCardData.length > 1

  return (
    <React.Fragment>
      <Gutter>
        <Typo.Title3 {...getHeadingAttrs(3)} numberOfLines={1}>
          {`Les avis par “${venue.name}”`}
        </Typo.Title3>
      </Gutter>
      <StyledChronicleCardlist
        data={advicesCardData}
        shouldTruncate
        onSeeMoreButtonPress={onPressChronicleCardSeeMore}
      />
      {shouldDisplayAllAdvicesButton ? (
        <Gutter>
          <SeeAllAdvicesContainer>
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

const StyledChronicleCardlist = styled(ChronicleCardList).attrs(({ theme }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.designSystem.size.spacing.l,
  },
  cardWidth: CHRONICLE_CARD_WIDTH,
  snapToInterval: CHRONICLE_CARD_WIDTH,
}))``

const SeeAllAdvicesContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))
