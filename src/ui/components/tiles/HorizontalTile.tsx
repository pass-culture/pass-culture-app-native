import React, { FC, PropsWithChildren } from 'react'
import { FlexStyle } from 'react-native'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { Tag } from 'ui/components/Tag/Tag'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { OfferName } from 'ui/components/tiles/OfferName'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Spacer, getSpacing } from 'ui/theme'
import { TypoDS } from 'ui/theme/designSystemTypographie'

export type HorizontalTileProps = PropsWithChildren<{
  title?: string
  categoryId: CategoryIdEnum
  imageUrl?: string
  distanceToOffer?: string
  price?: string
  withRightArrow?: boolean
}>

export const HorizontalTile: FC<HorizontalTileProps> = ({
  title = '',
  categoryId,
  imageUrl,
  distanceToOffer,
  price,
  withRightArrow,
  children,
}) => {
  return (
    <Container>
      <OfferImage imageUrl={imageUrl} categoryId={categoryId} />
      <Row flex={1} gap={getSpacing(4)} alignItems="space-between">
        <Column flex={1}>
          {distanceToOffer ? (
            <OfferName title={title} />
          ) : (
            <Row>
              <OfferNameContainer>
                <OfferName title={title} />
              </OfferNameContainer>
              {withRightArrow ? (
                <React.Fragment>
                  <Spacer.Row numberOfSpaces={1} />
                  <RightIcon testID="RightFilled" />
                </React.Fragment>
              ) : null}
            </Row>
          )}
          {children}
          {price ? <TypoDS.BodyAccentS>{price}</TypoDS.BodyAccentS> : null}
        </Column>
        {distanceToOffer ? <DistanceTag label={`à ${distanceToOffer}`} /> : null}
      </Row>
    </Container>
  )
}

const Flex = styled.View<FlexStyle>(({ flex, justifyContent, alignItems, gap, flexDirection }) => ({
  flexDirection,
  flex,
  alignItems,
  justifyContent,
  gap,
}))

const Column = Flex

const Row = styled(Flex).attrs({
  flexDirection: 'row',
})``

const Container = styled(Row).attrs({
  alignItems: 'center',
  flex: 1,
  gap: getSpacing(4),
})``

const DistanceTag = styled(Tag)(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
}))

const RightIcon = styled(RightFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})

const OfferNameContainer = styled.View({
  flexShrink: 1,
})
