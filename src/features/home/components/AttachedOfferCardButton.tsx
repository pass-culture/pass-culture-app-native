import React from 'react'
import styled from 'styled-components/native'

import {
  AttachedOfferCard,
  AttachedOfferCardProps,
} from 'features/home/components/AttachedOfferCard'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

type AttachedOfferCardButtonProps = AttachedOfferCardProps & {
  onPress: () => void
}

export const AttachedOfferCardButton = ({
  title,
  categoryId,
  imageUrl,
  distanceToOffer,
  price,
  tag,
  date,
  withRightArrow,
  onPress,
  showImage,
}: AttachedOfferCardButtonProps) => {
  const focusProps = useHandleFocus()

  return (
    <Container
      onPress={onPress}
      accessibilityLabel={`Carte offre "${title}"`}
      onMouseDown={(e) => e.preventDefault()}
      {...focusProps}>
      <AttachedOfferCard
        title={title}
        categoryId={categoryId}
        imageUrl={imageUrl}
        distanceToOffer={distanceToOffer}
        price={price}
        tag={tag}
        date={date}
        withRightArrow={withRightArrow}
        showImage={showImage}
      />
    </Container>
  )
}

const Container = styled(TouchableOpacity)<{
  onMouseDown: (e: Event) => void
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))
