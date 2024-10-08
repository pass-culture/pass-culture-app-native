import React, { FC, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { OfferName } from 'ui/components/tiles/OfferName'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Spacer } from 'ui/theme'
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
    <React.Fragment>
      <OfferImage imageUrl={imageUrl} categoryId={categoryId} />
      <Column>
        <Row>
          {distanceToOffer ? (
            <React.Fragment>
              <Spacer.Flex flex={0.7}>
                <OfferName title={title} />
              </Spacer.Flex>
              <Spacer.Flex flex={0.3}>
                <Distance>{distanceToOffer}</Distance>
              </Spacer.Flex>
            </React.Fragment>
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
        </Row>
        {children}
        {price ? <TypoDS.BodySemiBoldS>{price}</TypoDS.BodySemiBoldS> : null}
      </Column>
    </React.Fragment>
  )
}

const Column = styled.View({
  flexDirection: 'column',
  flex: 1,
})

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
})

const Distance = styled(TypoDS.BodySemiBoldS)(({ theme }) => ({
  textAlign: 'right',
  color: theme.colors.greyDark,
}))

const RightIcon = styled(RightFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})

const OfferNameContainer = styled.View({
  flexShrink: 1,
})
