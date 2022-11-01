import React, { memo, useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { ExclusivityImage } from 'features/home/components/modules/exclusivity/ExclusivityImage'
import { ExclusivityBannerProps } from 'features/home/components/modules/exclusivity/ExclusivityModule'
import { useShouldDisplayExcluOffer } from 'features/home/components/modules/exclusivity/helpers/useShouldDisplayExcluOffer'
import { ContentTypes } from 'features/home/contentful'
import { analytics } from 'libs/firebase/analytics'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

interface ExclusivityOfferProps extends ExclusivityBannerProps {
  offerId: number
}

const UnmemoizedExclusivityOffer = ({
  title,
  alt,
  image: imageURL,
  offerId,
  moduleId,
  display,
  homeEntryId,
  index,
  style,
}: ExclusivityOfferProps) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const shouldDisplayExcluOffer = useShouldDisplayExcluOffer(display, offerId)

  const handlePressExclu = useCallback(() => {
    if (typeof offerId !== 'number') return
    analytics.logExclusivityBlockClicked({ moduleName: title, moduleId, homeEntryId })
    analytics.logConsultOffer({
      offerId: offerId,
      moduleName: title,
      moduleId,
      from: 'exclusivity',
      homeEntryId,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerId])

  useEffect(() => {
    if (shouldDisplayExcluOffer) {
      analytics.logModuleDisplayedOnHomepage(moduleId, ContentTypes.EXCLUSIVITY, index, homeEntryId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldDisplayExcluOffer])

  if (!shouldDisplayExcluOffer) return <React.Fragment />

  return (
    <StyledTouchableLink
      highlight
      navigateTo={
        typeof offerId === 'number'
          ? { screen: 'Offer', params: { id: offerId, from: 'home' } }
          : undefined
      }
      onAfterNavigate={handlePressExclu}
      onFocus={onFocus}
      onBlur={onBlur}
      isFocus={isFocus}
      testID="link-exclusivity-offer"
      disabled={offerId === undefined}
      style={style}>
      <ExclusivityImage imageURL={imageURL} alt={alt} />
    </StyledTouchableLink>
  )
}

export const ExclusivityOffer = memo(UnmemoizedExclusivityOffer)

const StyledTouchableLink = styled(InternalTouchableLink)<{ isFocus?: boolean }>(
  ({ theme, isFocus }) => ({
    flex: 1,
    borderRadius: theme.borderRadius.radius,
    ...customFocusOutline({ isFocus, color: theme.colors.black }),
  })
)
