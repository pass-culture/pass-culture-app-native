import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { SubcategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { offerChroniclesToChronicleCardData } from 'features/chronicle/adapters/offerChroniclesToChronicleCardData/offerChroniclesToChronicleCardData'
import { useChronicles } from 'features/chronicle/api/useChronicles/useChronicles'
import { ChronicleOfferInfo } from 'features/chronicle/components/ChronicleOfferInfo/ChronicleOfferInfo.web'
import { isBookClubSubcategory } from 'features/chronicle/helpers/isBookClubSubcategory'
import { ChroniclesBase } from 'features/chronicle/pages/Chronicles/ChroniclesBase'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { chronicleVariant } from 'features/offer/helpers/chronicleVariant/chronicleVariant'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import {
  formatPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

export const Chronicles: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Chronicles'>>()
  const offerId = route.params?.offerId
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: offer } = useOfferQuery({ offerId })
  const subcategoriesMapping = useSubcategoriesMapping()
  const chronicleVariantInfo =
    chronicleVariant[offer?.subcategoryId ?? SubcategoryIdEnum.LIVRE_PAPIER]
  const { data: chronicleCardsData } = useChronicles<ChronicleCardData[]>({
    offerId,
    select: ({ chronicles }) =>
      offerChroniclesToChronicleCardData(chronicles, chronicleVariantInfo.subtitleItem),
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

  const imageDimensions = useOfferImageContainerDimensions(offer?.subcategoryId)

  const displayedPrice = getDisplayedPrice(
    prices,
    currency,
    euroToPacificFrancRate,
    formatPrice({
      isFixed: getIfPricesShouldBeFixed(offer?.subcategoryId),
      isDuo: !!(offer?.isDuo && user?.isBeneficiary),
    }),
    {
      fractionDigits: 2,
    }
  )

  const onPress = () => {
    navigate('Offer', { id: offerId, from: 'chronicles' })
  }

  const handleOnShowRecoButtonPress = () => {
    navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
  }

  if (!offer || !chronicleCardsData) return null

  return (
    <Container>
      <ChroniclesBase
        offerId={offer.id}
        offerName={offer.name}
        offerCategoryId={subcategory.categoryId}
        variantInfo={chronicleVariantInfo}
        chronicleCardsData={chronicleCardsData}
        onShowRecoButtonPress={handleOnShowRecoButtonPress}>
        {isDesktopViewport ? (
          <StyledChronicleOfferInfo
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
              />
            ) : (
              <ButtonPrimary wording="Trouve ta séance" onPress={onPress} />
            )}
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
