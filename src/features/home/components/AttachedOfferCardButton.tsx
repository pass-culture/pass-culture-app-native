import React from 'react'
import styled from 'styled-components/native'

import {
  AttachedOfferCard,
  AttachedOfferCardProps,
} from 'features/home/components/AttachedOfferCard'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type AttachedOfferCardButtonProps = AttachedOfferCardProps & {
  onBeforeNavigate?: () => void
  navigateTo: InternalNavigationProps['navigateTo']
}

export const AttachedOfferCardButton = ({
  title,
  categoryId,
  imageUrl,
  offerLocation,
  price,
  categoryText,
  date,
  withRightArrow,
  onBeforeNavigate,
  navigateTo,
  showImage,
}: AttachedOfferCardButtonProps) => {
  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()

  return (
    <Container
      navigateTo={navigateTo}
      onBeforeNavigate={onBeforeNavigate}
      accessibilityLabel={`Carte offre "${title}"`}
      onMouseDown={(e: Event) => e.preventDefault()}
      {...focusProps}
      {...hoverProps}>
      <AttachedOfferCard
        title={title}
        categoryId={categoryId}
        imageUrl={imageUrl}
        offerLocation={offerLocation}
        price={price}
        categoryText={categoryText}
        date={date}
        withRightArrow={withRightArrow}
        showImage={showImage}
      />
    </Container>
  )
}

const Container = styled(InternalTouchableLink)<{
  onMouseDown: (e: Event) => void
  isFocus: boolean
  isHover: boolean
}>(({ theme, isFocus, isHover }) => ({
  borderRadius: getSpacing(3),
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  ...getHoverStyle(theme.colors.black, isHover),
}))
