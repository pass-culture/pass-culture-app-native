import React, { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { useExcluOffer } from 'features/home/api/useExcluOffer'
import { ExclusivityImage } from 'features/home/components/modules/ExclusivityImage'
import { ExclusivityModuleProps } from 'features/home/components/modules/ExclusivityModule'
import { shouldDisplayExcluOffer } from 'features/home/components/modules/ExclusivityModule.utils'
import { ContentTypes } from 'features/home/contentful'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

interface ExclusivityOfferProps extends ExclusivityModuleProps {
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
}: ExclusivityOfferProps) => {
  const [isFocus, setIsFocus] = useState(false)
  const { data: offer } = useExcluOffer(offerId)
  const { position } = useGeolocation()
  const maxPrice = useMaxPrice()

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

  const shouldModuleBeDisplayed = shouldDisplayExcluOffer(display, offer, position, maxPrice)

  useEffect(() => {
    if (shouldModuleBeDisplayed) {
      analytics.logModuleDisplayedOnHomepage(moduleId, ContentTypes.EXCLUSIVITY, index, homeEntryId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldModuleBeDisplayed])

  if (!shouldModuleBeDisplayed) return <React.Fragment />

  return (
    <StyledTouchableLink
      highlight
      navigateTo={
        typeof offerId === 'number'
          ? { screen: 'Offer', params: { id: offerId, from: 'home' } }
          : undefined
      }
      onAfterNavigate={handlePressExclu}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      isFocus={isFocus}
      testID="link-exclusivity-offer"
      disabled={offerId === undefined}>
      <ExclusivityImage imageURL={imageURL} alt={alt} />
    </StyledTouchableLink>
  )
}

export const ExclusivityOffer = memo(UnmemoizedExclusivityOffer)

const StyledTouchableLink = styled(TouchableLink)<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  flex: 1,
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))
