import React, { FunctionComponent } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { styled, useTheme } from 'styled-components/native'

import { OfferResponse, SubcategoryResponseModelv2 } from 'api/gen'
import { AdvicesOfferInfo } from 'features/advices/components/AdvicesOfferInfo/AdvicesOfferInfo.web'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { isBookClubSubcategory } from 'features/clubAdvices/helpers/isBookClubSubcategory'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { formatPrice, getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Button } from 'ui/designSystem/Button/Button'

type Props = {
  offer: OfferResponse
  subcategoriesMapping: SubcategoriesMapping
  subcategory: SubcategoryResponseModelv2
  onPress: () => void
}

export const AdvicesOfferColumn: FunctionComponent<Props> = ({
  offer,
  subcategoriesMapping,
  subcategory,
  onPress,
}) => {
  const { isDesktopViewport, appBarHeight } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top

  const { user } = useAuthContext()

  const prices = getOfferPrices(offer?.stocks ?? [])
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const displayedPrice = getDisplayedPrice(
    prices,
    currency,
    euroToPacificFrancRate,
    formatPrice({
      isDuo: !!(offer?.isDuo && user?.isBeneficiary),
    }),
    {
      fractionDigits: 2,
    }
  )

  const imageDimensions = useOfferImageContainerDimensions(offer?.subcategoryId)
  const { trackEventHasSeenOfferOnce } = useOfferBatchTracking(subcategory.id)

  return isDesktopViewport ? (
    <StyledAdvicesOfferInfo
      imageUrl={offer.images?.recto?.url ?? ''}
      title={offer.name}
      price={displayedPrice}
      categoryId={subcategory.categoryId}
      paddingTop={headerHeight}
      imageDimensions={imageDimensions}>
      {isBookClubSubcategory(offer.subcategoryId) ? (
        <OfferCTAButton
          offer={offer}
          subcategory={subcategoriesMapping[offer.subcategoryId]}
          trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
          fullScreen
        />
      ) : (
        <Button wording="Trouve ta séance" onPress={onPress} color="brand" />
      )}
    </StyledAdvicesOfferInfo>
  ) : null
}

const StyledAdvicesOfferInfo = styled(AdvicesOfferInfo)<{ paddingTop: number }>(
  ({ paddingTop }) => ({
    paddingTop,
  })
)
