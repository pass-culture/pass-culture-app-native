import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent } from 'react-native'
import { useQueryClient } from 'react-query'
import styled, { useTheme } from 'styled-components/native'

import { FavoriteOfferResponse, FavoriteResponse, UserProfileResponse } from 'api/gen'
import { useRemoveFavorite } from 'features/favorites/pages/useFavorites'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { mergeOfferData } from 'features/offer/atoms/OfferTile'
import { OfferImage } from 'features/search/atoms/OfferImage'
import { analytics } from 'libs/analytics'
import { useDistance } from 'libs/geolocation/hooks/useDistance'
import { formatToFrenchDate, getFavoriteDisplayPrice } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { useSearchGroupLabel, useSubcategory } from 'libs/subcategories'
import { AppButton } from 'ui/components/buttons/AppButton'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

import { BookingButton } from './BookingButton'

interface Props {
  favorite: FavoriteResponse
  onInAppBooking: (bookedOffer: FavoriteOfferResponse) => void
  user: UserProfileResponse
}

export const Favorite: React.FC<Props> = (props) => {
  const { offer } = props.favorite
  const theme = useTheme()
  const [height, setHeight] = useState<number | undefined>(undefined)
  const animatedOpacity = useRef(new Animated.Value(1)).current
  const animatedCollapse = useRef(new Animated.Value(1)).current
  const { navigate } = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()
  const distanceToOffer = useDistance({
    lat: offer.coordinates?.latitude,
    lng: offer.coordinates?.longitude,
  })
  const { showErrorSnackBar } = useSnackBarContext()
  const { categoryId, searchGroupName } = useSubcategory(offer.subcategoryId)
  const searchGroupLabel = useSearchGroupLabel(searchGroupName)

  const { mutate: removeFavorite, isLoading } = useRemoveFavorite({
    onError: () => {
      showErrorSnackBar({
        message: t`L'offre n'a pas été retirée de tes favoris`,
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const formattedDate = useMemo(() => {
    if (offer.date) {
      return formatToFrenchDate(new Date(offer.date))
    }
    if (offer.startDate) {
      return t({
        id: 'starting from date',
        values: { date: formatToFrenchDate(new Date(offer.startDate)) },
        message: 'Dès le {date}',
      })
    }
    return null
  }, [offer])

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from the search result for a smooth transition
    if (!offer.id) return
    queryClient.setQueryData(
      [QueryKeys.OFFER, offer.id],
      mergeOfferData({
        ...offer,
        categoryId,
        thumbUrl: offer.image?.url,
        name: offer.name,
        offerId: offer.id,
      })
    )
    analytics.logConsultOffer({ offerId: offer.id, from: 'favorites' })
    navigate('Offer', { id: offer.id, from: 'favorites' })
  }

  function onRemove() {
    Animated.parallel([
      Animated.timing(animatedOpacity, {
        toValue: 0,
        delay: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedCollapse, {
        toValue: 0,
        delay: 100,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      removeFavorite(props.favorite.id)
    })
  }

  function onLayout(event: LayoutChangeEvent) {
    const { height: newHeight } = event.nativeEvent.layout
    if (!height) {
      setHeight(newHeight)
    }
  }

  return (
    <Animated.View
      onLayout={onLayout}
      style={{
        opacity: animatedOpacity,
        height: height
          ? animatedCollapse.interpolate({
              inputRange: [0, 1],
              outputRange: [0, height],
            })
          : undefined,
      }}>
      <Container onPress={handlePressOffer} testID="favorite">
        <Row>
          <OfferImage imageUrl={offer.image?.url} categoryId={categoryId} />
          <Spacer.Row numberOfSpaces={4} />
          <Column>
            <Row>
              {distanceToOffer ? (
                <React.Fragment>
                  <Spacer.Flex flex={0.7}>
                    <Name numberOfLines={2}>{offer.name}</Name>
                  </Spacer.Flex>
                  <Spacer.Flex flex={0.3}>
                    <Distance>{distanceToOffer}</Distance>
                  </Spacer.Flex>
                </React.Fragment>
              ) : (
                <Name numberOfLines={2}>{offer.name}</Name>
              )}
            </Row>
            <Spacer.Column numberOfSpaces={1} />
            <Body>{searchGroupLabel}</Body>
            {!!formattedDate && <Body>{formattedDate}</Body>}
            <Spacer.Column numberOfSpaces={1} />
            <Typo.Caption>
              {getFavoriteDisplayPrice({ startPrice: offer.startPrice, price: offer.price })}
            </Typo.Caption>
          </Column>
        </Row>
      </Container>
      <ButtonsRow>
        <ButtonContainer>
          <AppButton
            title={t`Supprimer`}
            onPress={onRemove}
            textColor={ColorsEnum.BLACK}
            borderColor={ColorsEnum.GREY_MEDIUM}
            backgroundColor={ColorsEnum.WHITE}
            loadingIconColor={ColorsEnum.PRIMARY}
            buttonHeight="tall"
            disabled={isLoading}
          />
        </ButtonContainer>
        {!theme.isMobileViewport && <Spacer.Flex flex={1 / 30} />}
        <ButtonContainer>
          <BookingButton offer={offer} user={props.user} onInAppBooking={props.onInAppBooking} />
        </ButtonContainer>
      </ButtonsRow>
      <Separator />
    </Animated.View>
  )
}

const imageWidth = getSpacing(16)

const Container = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({ marginHorizontal: getSpacing(6) })

const columnPadding = 4
const columnMargin = 2 * 6

const Column = styled.View(({ theme }) => ({
  width: theme.appContentWidth - getSpacing(columnMargin + columnPadding) - imageWidth,
}))

const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })

const ButtonContainer = styled.View({
  minWidth: getSpacing(30),
  maxWidth: getSpacing(70),
  width: '47%',
})

const ButtonsRow = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: theme.isMobileViewport ? 'space-between' : 'center',
  marginTop: getSpacing(6),
  marginHorizontal: getSpacing(6),
}))

const Name = styled(Typo.ButtonText)({})

const Distance = styled(Typo.Body)({ textAlign: 'right', color: ColorsEnum.GREY_DARK })

const Body = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })

const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
})
