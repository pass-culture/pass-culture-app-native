import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { SubcategoryIdEnumv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { offerChroniclesToChronicleCardData } from 'features/chronicle/adapters/offerChroniclesToChronicleCardData/offerChroniclesToChronicleCardData'
import { useChronicles } from 'features/chronicle/api/useChronicles/useChronicles'
import { ChronicleCardList } from 'features/chronicle/components/ChronicleCardList/ChronicleCardList'
import { ChronicleOfferInfo } from 'features/chronicle/components/ChronicleOfferInfo/ChronicleOfferInfo.web'
import { ChroniclesHeader } from 'features/chronicle/components/ChroniclesHeader/ChroniclesHeader'
import { ChroniclesWebMetaHeader } from 'features/chronicle/components/ChroniclesWebMetaHeader/ChroniclesWebMetaHeader'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOffer } from 'features/offer/api/useOffer'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { TypoDS, getSpacing } from 'ui/theme'

export const Chronicles: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Chronicles'>>()
  const offerId = route.params?.offerId
  const { goBack } = useGoBack('Offer', { id: offerId })
  const { data: offer } = useOffer({ offerId })
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

  const { headerTransition, onScroll } = useOpacityTransition()
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

  const title = `Tous les avis sur "${offer.name}"`

  const listComponent = (
    <StyledChronicleCardList
      data={chronicleCardsData}
      onScroll={onScroll}
      paddingTop={headerHeight}
      headerComponent={<StyledTitle2>Tous les avis</StyledTitle2>}
    />
  )

  return (
    <Container>
      <ChroniclesWebMetaHeader title={title} />
      <ChroniclesHeader handleGoBack={goBack} headerTransition={headerTransition} title={title} />

      {isDesktopViewport ? (
        <FullFlexRow>
          <StyledChronicleOfferInfo
            imageUrl={offer.images?.[0]?.url ?? ''}
            title={offer.name}
            price={displayedPrice}
            paddingTop={headerHeight}>
            <OfferCTAButton
              offer={offer}
              subcategory={subcategoriesMapping[offer.subcategoryId]}
              trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
            />
          </StyledChronicleOfferInfo>
          {listComponent}
        </FullFlexRow>
      ) : (
        listComponent
      )}
    </Container>
  )
}

const StyledTitle2 = styled(TypoDS.Title2)({
  marginBottom: getSpacing(6),
})

const FullFlexView = styled.View({
  flex: 1,
})

const FullFlexRow = styled(FullFlexView)({
  flexDirection: 'row',
  columnGap: getSpacing(18),
})

const Container = styled(FullFlexView)(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingTop: theme.contentPage.marginVertical,
}))

const StyledChronicleCardList = styled(ChronicleCardList).attrs<{ paddingTop: number }>(
  ({ paddingTop }) => ({
    horizontal: false,
    separatorSize: 6,
    contentContainerStyle: { paddingVertical: paddingTop },
  })
)<{ paddingTop: number }>({
  flex: 1,
})

const StyledChronicleOfferInfo = styled(ChronicleOfferInfo)<{ paddingTop: number }>(
  ({ paddingTop }) => ({
    paddingTop,
    flex: 1,
  })
)
