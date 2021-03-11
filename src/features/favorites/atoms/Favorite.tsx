import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { FavoriteResponse } from 'api/gen'
import { useRemoveFavorite } from 'features/favorites/pages/useFavorites'
import { mergeOfferData } from 'features/home/atoms/OfferTile'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useDistance } from 'features/offer/components/useDistance'
import { OfferImage } from 'features/search/atoms/OfferImage'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { _ } from 'libs/i18n'
import { formatToFrenchDate, getFavoriteDisplayPrice, parseCategory } from 'libs/parsers'
import { AppButton } from 'ui/components/buttons/AppButton'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  favorite: FavoriteResponse
}

export const Favorite: React.FC<Props> = ({ favorite }) => {
  const { id, offer } = favorite
  const { price, startPrice } = offer
  const navigation = useNavigation<UseNavigationType>()
  const queryClient = useQueryClient()
  const distanceToOffer = useDistance({
    lat: offer.coordinates.latitude,
    lng: offer.coordinates.longitude,
  })
  const { showSuccessSnackBar, showErrorSnackBar } = useSnackBarContext()

  const { mutate: removeFavorite, isLoading } = useRemoveFavorite({
    onSuccess: () => {
      showSuccessSnackBar({
        message: _(t`L'offre a été retirée des favoris`),
        timeout: SNACK_BAR_TIME_OUT,
      })
    },

    onError: () => {
      showErrorSnackBar({
        message: _(t`L'offre n'a pas été retirée des favoris`),
        timeout: SNACK_BAR_TIME_OUT,
      })
    },
  })

  const categoryLabel = CATEGORY_CRITERIA[offer.category.name || 'ALL'].label
  const formattedDate = useMemo(() => {
    if (offer.date) {
      return formatToFrenchDate(new Date(offer.date))
    }
    if (offer.startDate) {
      return _(t`Dès le ${formatToFrenchDate(new Date(offer.startDate))}`)
    }
    return null
  }, [offer])

  function handlePressOffer() {
    // We pre-populate the query-cache with the data from algolia for a smooth transition
    if (!offer.id) return
    queryClient.setQueryData(
      ['offer', offer.id],
      mergeOfferData({
        ...offer,
        category: parseCategory(offer.category.name),
        categoryName: offer.category.name,
        description: '',
        thumbUrl: offer.image?.url,
        name: offer.name,
        offerId: offer.id,
      })
    )
    navigation.navigate('Offer', { id: offer.id, shouldDisplayLoginModal: false })
  }

  return (
    <Container onPress={handlePressOffer} testID="favorite">
      <Row>
        <OfferImage imageUrl={offer.image?.url} categoryName={offer.category.name} />
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
          <Body>{categoryLabel}</Body>
          {formattedDate && <Body>{formattedDate}</Body>}
          <Spacer.Column numberOfSpaces={1} />
          <Typo.Caption>{getFavoriteDisplayPrice({ startPrice, price })}</Typo.Caption>
        </Column>
      </Row>
      <ButtonContainer>
        <AppButton
          title={_(t`Supprimer`)}
          onPress={() => removeFavorite(id)}
          textColor={ColorsEnum.GREY_DARK}
          borderColor={ColorsEnum.GREY_MEDIUM}
          backgroundColor={ColorsEnum.WHITE}
          loadingIconColor={ColorsEnum.PRIMARY}
          buttonHeight="tall"
          disabled={isLoading}
        />
      </ButtonContainer>
    </Container>
  )
}

const { width } = Dimensions.get('window')
const imageWidth = getSpacing(16)

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({ marginHorizontal: getSpacing(6) })

const columnPadding = 4
const columnMargin = 2 * 6
const Column = styled.View({ width: width - getSpacing(columnMargin + columnPadding) - imageWidth })
const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })
const ButtonContainer = styled.View({
  maxWidth: getSpacing(44),
  marginTop: getSpacing(6),
})

const Name = styled(Typo.ButtonText)({})
const Distance = styled(Typo.Body)({ textAlign: 'right', color: ColorsEnum.GREY_DARK })
const Body = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })
