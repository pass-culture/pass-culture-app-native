import React, { memo, useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { ExclusivityImage } from 'features/home/components/modules/exclusivity/ExclusivityImage'
import { ExclusivityBannerProps } from 'features/home/components/modules/exclusivity/ExclusivityModule'
import { useShouldDisplayExcluOffer } from 'features/home/components/modules/exclusivity/helpers/useShouldDisplayExcluOffer'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { analytics } from 'libs/analytics/provider'
import { ContentTypes } from 'libs/contentful/types'
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
  displayParameters,
  homeEntryId,
  index,
  style,
}: ExclusivityOfferProps) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const shouldDisplayExcluOffer = useShouldDisplayExcluOffer(displayParameters, offerId)

  const handlePressExclu = useCallback(() => {
    if (typeof offerId !== 'number') return
    analytics.logExclusivityBlockClicked({ moduleName: title, moduleId, homeEntryId })
    triggerConsultOfferLog({
      offerId,
      moduleName: title,
      moduleId,
      from: 'exclusivity',
      homeEntryId,
    })
  }, [homeEntryId, moduleId, offerId, title])

  useEffect(() => {
    if (shouldDisplayExcluOffer) {
      analytics.logModuleDisplayedOnHomepage({
        moduleId,
        moduleType: ContentTypes.EXCLUSIVITY,
        index,
        homeEntryId,
        offers: [String(offerId)],
      })
    }
  }, [homeEntryId, index, moduleId, offerId, shouldDisplayExcluOffer])

  if (!shouldDisplayExcluOffer) return null

  return (
    <StyledTouchableLink
      highlight
      navigateTo={{ screen: 'Offer', params: { id: offerId, from: 'home' } }}
      onAfterNavigate={handlePressExclu}
      onFocus={onFocus}
      onBlur={onBlur}
      isFocus={isFocus}
      disabled={offerId === undefined}
      style={style}
      accessibilityLabel={alt}
      accessibilityRole={AccessibilityRole.LINK}>
      <ExclusivityImage imageURL={imageURL} alt={alt} />
    </StyledTouchableLink>
  )
}

export const ExclusivityOffer = memo(UnmemoizedExclusivityOffer)

const StyledTouchableLink: typeof InternalTouchableLink = styled(InternalTouchableLink)<{
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  flex: 1,
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))
