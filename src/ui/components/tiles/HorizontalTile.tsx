import React, { FC, PropsWithChildren } from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { OfferName } from 'ui/components/tiles/OfferName'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
              <OfferName title={title} />
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
        {price ? <Typo.Caption>{price}</Typo.Caption> : null}
      </Column>
    </React.Fragment>
  )
}

const Column = styled.View({
  flexDirection: 'column',
  flex: 1,
  gap: getSpacing(1),
})

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const Distance = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'right',
  color: theme.colors.greyDark,
}))

const RightIcon = styled(RightFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})
