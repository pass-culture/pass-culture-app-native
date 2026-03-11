import React, { FunctionComponent } from 'react'
import { styled } from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { CHRONICLE_CARD_WIDTH } from 'features/chronicle/constant'
import { ChronicleCardData } from 'features/chronicle/type'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { InfoPlain } from 'ui/svg/icons/InfoPlain'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  venue: VenueResponse
  advicesCardData: ChronicleCardData[]
  nbAdvices: number
  onShowWritersModal: () => void
  onPressChronicleCardSeeMore?: () => void
  enableNewTagProAdvices?: boolean
}

export const VenueAdvicesSection: FunctionComponent<Props> = ({
  venue,
  advicesCardData,
  nbAdvices,
  onShowWritersModal,
  onPressChronicleCardSeeMore,
  enableNewTagProAdvices,
}) => {
  const shouldDisplayAllAdvicesButton = advicesCardData.length > 1

  return (
    <React.Fragment>
      <Gutter>
        <Row>
          <StyledTitle3 {...getHeadingAttrs(3)} numberOfLines={1}>
            {`Les avis par “${venue.name}”`}
          </StyledTitle3>
          {enableNewTagProAdvices ? (
            <TagContainer>
              <Tag variant={TagVariant.NEW} label="Nouveau" />
            </TagContainer>
          ) : null}
        </Row>
      </Gutter>
      <StyledChronicleCardlist
        data={advicesCardData}
        shouldTruncate
        onSeeMoreButtonPress={onPressChronicleCardSeeMore}
        shouldDisplayAllAdvicesButton={shouldDisplayAllAdvicesButton}
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
      <Gutter>
        <WritersButtonContainer>
          <Button
            wording="Qui écrit les avis des pros&nbsp;?"
            icon={InfoPlain}
            onPress={onShowWritersModal}
            variant="tertiary"
            color="neutral"
            size="small"
          />
        </WritersButtonContainer>
      </Gutter>
    </React.Fragment>
  )
}

const Gutter = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })

const StyledTitle3 = styled(Typo.Title3)({
  flexShrink: 1,
})

const StyledChronicleCardlist = styled(ChronicleCardList).attrs<{
  shouldDisplayAllAdvicesButton: boolean
}>(({ theme, shouldDisplayAllAdvicesButton }) => ({
  contentContainerStyle: {
    paddingHorizontal: theme.contentPage.marginHorizontal,
    paddingVertical: theme.designSystem.size.spacing.l,
    paddingBottom: shouldDisplayAllAdvicesButton ? undefined : theme.designSystem.size.spacing.l,
  },
  cardWidth: CHRONICLE_CARD_WIDTH,
  snapToInterval: CHRONICLE_CARD_WIDTH,
}))``

const SeeAllAdvicesContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const TagContainer = styled.View(({ theme }) => ({
  marginLeft: theme.designSystem.size.spacing.s,
  flexShrink: 0,
}))

const WritersButtonContainer = styled.View(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xxl,
}))
