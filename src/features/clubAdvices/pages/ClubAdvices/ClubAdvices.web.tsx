import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { SubcategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'
import { AdviceCardData } from 'features/advices/types'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { clubAdvicesToAdviceCardData } from 'features/clubAdvices/adapters/clubAdvicesToAdviceCardData/clubAdvicesToAdviceCardData'
import { ClubAdviceOfferInfo } from 'features/clubAdvices/components/ClubAdviceOfferInfo/ClubAdviceOfferInfo.web'
import { clubAdviceVariant } from 'features/clubAdvices/helpers/clubAdviceVariant'
import { isBookClubSubcategory } from 'features/clubAdvices/helpers/isBookClubSubcategory'
import { ClubAdvicesBase } from 'features/clubAdvices/pages/ClubAdvices/ClubAdvicesBase'
import { useClubAdvicesQuery } from 'features/clubAdvices/queries/useClubAdvicesQuery'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferImageContainerDimensions } from 'features/offer/helpers/useOfferImageContainerDimensions'
import { analytics } from 'libs/analytics/provider'
import {
  formatPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { Button } from 'ui/designSystem/Button/Button'

export const ClubAdvices: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'ClubAdvices'>>()
  const offerId = route.params?.offerId
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: offer } = useOfferQuery({ offerId })
  const subcategoriesMapping = useSubcategoriesMapping()
  const adviceVariantInfo =
    clubAdviceVariant[offer?.subcategoryId ?? SubcategoryIdEnum.LIVRE_PAPIER]
  const { data: adviceCardsData } = useClubAdvicesQuery<AdviceCardData[]>({
    offerId,
    select: ({ chronicles: advices }) =>
      clubAdvicesToAdviceCardData(advices, adviceVariantInfo.subtitleItem),
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
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()

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
    analytics.logClickAllClubRecos({
      offerId: offerId.toString(),
      from: 'chronicles',
      categoryName: offer?.subcategoryId
        ? subcategoriesMapping[offer.subcategoryId].categoryId
        : '',
    })
    navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
  }

  if (!offer || !adviceCardsData) return null

  return (
    <Container>
      <ClubAdvicesBase
        offerId={offer.id}
        offerName={offer.name}
        offerCategoryId={subcategory.categoryId}
        variantInfo={adviceVariantInfo}
        adviceCardsData={adviceCardsData}
        onShowRecoButtonPress={handleOnShowRecoButtonPress}>
        {isDesktopViewport ? (
          <StyledClubAdviceOfferInfo
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
          </StyledClubAdviceOfferInfo>
        ) : null}
      </ClubAdvicesBase>
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

const StyledClubAdviceOfferInfo = styled(ClubAdviceOfferInfo)<{ paddingTop: number }>(
  ({ paddingTop }) => ({
    paddingTop,
  })
)
