import React, { FunctionComponent } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { Color } from 'features/home/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getShadow, getSpacing } from 'ui/theme'

type Props = {
  offer: Offer
  color: Color
  hideModal: () => void
  analyticsParams: OfferAnalyticsParams
  style?: StyleProp<ViewStyle>
}

export const VideoMonoOfferTile: FunctionComponent<Props> = ({
  offer,
  hideModal,
  analyticsParams,
  style,
}) => {
  const mapping = useCategoryIdMapping()
  const prePopulateOffer = usePrePopulateOffer()
  const theme = useTheme()

  const offerHeight = theme.isDesktopViewport ? getSpacing(45) : getSpacing(35)

  const categoryId = mapping[offer.offer.subcategoryId]

  const containerProps = {
    offerHeight,
    style,
    navigateTo: {
      screen: 'Offer',
      params: { id: +offer.objectID },
    },
    onBeforeNavigate: () => {
      hideModal()
      prePopulateOffer({
        ...offer.offer,
        offerId: +offer.objectID,
        categoryId,
      })
      triggerConsultOfferLog({
        offerId: +offer.objectID,
        ...analyticsParams,
      })
    },
  }

  return (
    <StyledInternalTouchableLink {...containerProps} testID="videoMonoOfferTile">
      <AttachedOfferCard offer={offer} />
    </StyledInternalTouchableLink>
  )
}

const StyledInternalTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  borderRadius: getSpacing(3),
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(3),
    },
    shadowRadius: getSpacing(12),
    shadowColor: theme.designSystem.color.background.lockedInverted,
    shadowOpacity: 0.15,
  }),
}))
