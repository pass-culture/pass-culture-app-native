import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { SubcategoryIdEnumv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { offerChroniclesToChronicleCardData } from 'features/chronicle/adapters/offerChroniclesToChronicleCardData/offerChroniclesToChronicleCardData'
import { useChronicles } from 'features/chronicle/api/useChronicles/useChronicles'
import { ChronicleOfferInfo } from 'features/chronicle/components/ChronicleOfferInfo/ChronicleOfferInfo.web'
import { ChroniclesBase } from 'features/chronicle/pages/Chronicles/ChroniclesBase'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOfferQuery } from 'queries/useOfferQuery/useOfferQuery'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'

export const Chronicles: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Chronicles'>>()
  const offerId = route.params?.offerId
  const { data: offer } = useOfferQuery({ offerId })
  const subcategoriesMapping = useSubcategoriesMapping()

  const { data: chronicleCardsData } = useChronicles<ChronicleCardData[]>({
    offerId,
    select: ({ chronicles }) => offerChroniclesToChronicleCardData(chronicles),
  })

  const { user } = useAuthContext()
  const { appBarHeight, isDesktopViewport } = useTheme()
  const { top } = useSafeAreaInsets()
  const headerHeight = appBarHeight + top
  const subcategory = offer
    ? subcategoriesMapping[offer.subcategoryId]
    : subcategoriesMapping[SubcategoryIdEnumv2.CONCERT]

  const { trackEventHasSeenOfferOnce } = useOfferBatchTracking(subcategory.id)
  const prices = getOfferPrices(offer?.stocks ?? [])
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()

  const displayedPrice = getDisplayedPrice(
    prices,
    currency,
    euroToPacificFrancRate,
    offer?.isDuo && user?.isBeneficiary,
    { fractionDigits: 2 }
  )

  if (!offer || !chronicleCardsData) return null

  return (
    <Container>
      <ChroniclesBase
        offerId={offer.id}
        offerName={offer.name}
        chronicleCardsData={chronicleCardsData}>
        {isDesktopViewport ? (
          <StyledChronicleOfferInfo
            imageUrl={offer.images?.recto?.url ?? ''}
            title={offer.name}
            price={displayedPrice}
            categoryId={subcategory.categoryId}
            paddingTop={headerHeight}>
            <OfferCTAButton
              offer={offer}
              subcategory={subcategoriesMapping[offer.subcategoryId]}
              trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
            />
          </StyledChronicleOfferInfo>
        ) : null}
      </ChroniclesBase>
    </Container>
  )
}

const FullFlexView = styled.View({
  flex: 1,
})

const Container = styled(FullFlexView)(({ theme }) => ({
  ...(theme.isDesktopViewport
    ? {
        paddingHorizontal: theme.contentPage.marginHorizontal,
        paddingTop: theme.contentPage.marginVertical,
      }
    : {}),
}))

const StyledChronicleOfferInfo = styled(ChronicleOfferInfo)<{ paddingTop: number }>(
  ({ paddingTop }) => ({
    paddingTop,
  })
)
