import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { OfferName } from 'ui/components/tiles/OfferName'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Spacer, Typo, getSpacing } from 'ui/theme'

type Props = {
  title: string
  categoryId: CategoryIdEnum
  imageUrl?: string
  distanceToOffer?: string
  subtitles: string[]
  price?: string
  withRightArrow?: boolean
}

export const HorizontalTile = ({
  title,
  categoryId,
  imageUrl,
  distanceToOffer,
  subtitles,
  price,
  withRightArrow,
}: Props) => {
  return (
    <Container>
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
        {!!subtitles?.length &&
          subtitles?.map((subtitle, index) => <Body key={`${subtitle}_${index}`}>{subtitle}</Body>)}
        {!!price && <Typo.Caption>{price}</Typo.Caption>}
      </Column>
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  outlineOffset: 0,
  gap: getSpacing(4),
})

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

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const RightIcon = styled(RightFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})
