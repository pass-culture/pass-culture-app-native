import React from 'react'
import styled from 'styled-components/native'

import {
  AttachedOfferCard,
  AttachedOfferCardProps,
} from 'features/home/components/AttachedOfferCard'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type AttachedOfferCardButtonProps = AttachedOfferCardProps & {
  onPress: () => void
}

export const AttachedOfferCardButton = ({
  title,
  categoryId,
  imageUrl,
  offerLocation: geoloc,
  price,
  categoryText,
  date,
  withRightArrow,
  onPress,
  showImage,
}: AttachedOfferCardButtonProps) => {
  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()

  return (
    <Container
      onPress={onPress}
      accessibilityLabel={`Carte offre "${title}"`}
      onMouseDown={(e) => e.preventDefault()}
      {...focusProps}
      {...hoverProps}>
      <AttachedOfferCard
        title={title}
        categoryId={categoryId}
        imageUrl={imageUrl}
        offerLocation={geoloc}
        price={price}
        categoryText={categoryText}
        date={date}
        withRightArrow={withRightArrow}
        showImage={showImage}
      />
    </Container>
  )
}

const Container = styled(TouchableOpacity)<{
  onMouseDown: (e: Event) => void
  isFocus: boolean
  isHover: boolean
}>(({ theme, isFocus, isHover }) => ({
  borderRadius: getSpacing(3),
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  ...getHoverStyle(theme.colors.black, isHover),
}))
