import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { useQueryClient } from 'react-query'
import styled from 'styled-components/native'

import { FavoriteOfferResponse, FavoriteResponse, UserProfileResponse } from 'api/gen'
import { useRemoveFavorite } from 'features/favorites/pages/useFavorites'
import { mergeOfferData } from 'features/home/atoms/OfferTile'
import { Credit } from 'features/home/services/useAvailableCredit'
import { openExternalUrl } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useDistance } from 'features/offer/components/useDistance'
import { OfferImage } from 'features/search/atoms/OfferImage'
import { CATEGORY_CRITERIA } from 'libs/algolia/enums'
import { _ } from 'libs/i18n'
import { formatToFrenchDate, getFavoriteDisplayPrice, parseCategory } from 'libs/parsers'
import { AppButton } from 'ui/components/buttons/AppButton'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { SNACK_BAR_TIME_OUT, useSnackBarContext } from 'ui/components/snackBar/SnackBarContext'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'

interface Props {
  credit: Credit
  favorite: FavoriteResponse
  setOfferToBook: React.Dispatch<React.SetStateAction<FavoriteOfferResponse | null>>
  user: UserProfileResponse
}

export const Favorite: React.FC<Props> = (props) => {
  const { offer } = props.favorite
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
        message: _(t`L'offre a été retirée de tes favoris`),
        timeout: SNACK_BAR_TIME_OUT,
      })
    },

    onError: () => {
      showErrorSnackBar({
        message: _(t`L'offre n'a pas été retirée de tes favoris`),
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
    navigation.navigate('Offer', {
      id: offer.id,
      shouldDisplayLoginModal: false,
      from: 'favorites',
    })
  }

  function renderBookingButton() {
    const isFreeOffer = getIsFreeOffer(offer)
    const hasEnoughCredit = getHasEnoughCredit(offer, props.credit)
    const { isBeneficiary } = props.user

    // User is NOT beneficiary
    if (!isBeneficiary) {
      if (offer.isExpired || offer.isExhausted) {
        return null
      }
      return <BookExternallyButton url={offer.externalTicketOfficeUrl} />
    }

    // User is an ex-beneficiary == beneficiary with expired credit
    if (isBeneficiary && props.credit.isExpired) {
      if (offer.isExpired || offer.isExhausted) {
        return null
      }
      if (isFreeOffer) {
        return <BookInAppButton onPress={() => props.setOfferToBook(offer)} />
      }
      return <BookExternallyButton url={offer.externalTicketOfficeUrl} />
    }

    // User is beneficiary
    if (offer.isExpired) {
      return <ButtonPrimary title={_(t`Offre expirée`)} buttonHeight="tall" disabled />
    }
    if (offer.isExhausted) {
      return <ButtonPrimary title={_(t`Offre épuisée`)} buttonHeight="tall" disabled />
    }
    if (!isFreeOffer && !hasEnoughCredit) {
      return <ButtonPrimary title={_(t`Crédit insuffisant`)} buttonHeight="tall" disabled />
    }
    return <BookInAppButton onPress={() => props.setOfferToBook(offer)} />
  }
  const bookingButton = useMemo(renderBookingButton, [props])

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
          <Typo.Caption>
            {getFavoriteDisplayPrice({ startPrice: offer.startPrice, price: offer.price })}
          </Typo.Caption>
        </Column>
      </Row>
      <ButtonsRow>
        <ButtonContainer>
          <AppButton
            title={_(t`Supprimer`)}
            onPress={() => removeFavorite(props.favorite.id)}
            textColor={ColorsEnum.BLACK}
            borderColor={ColorsEnum.GREY_MEDIUM}
            backgroundColor={ColorsEnum.WHITE}
            loadingIconColor={ColorsEnum.PRIMARY}
            buttonHeight="tall"
            disabled={isLoading}
          />
        </ButtonContainer>
        <ButtonContainer>{bookingButton}</ButtonContainer>
      </ButtonsRow>
    </Container>
  )
}

const BookInAppButton = ({ onPress }: { onPress: () => void }) => (
  <ButtonPrimary title={_(t`Réserver`)} onPress={onPress} buttonHeight="tall" />
)

const BookExternallyButton = ({ url }: { url: FavoriteOfferResponse['externalTicketOfficeUrl'] }) =>
  url ? (
    <ButtonPrimary
      title={_(t`Réserver`)}
      onPress={() => url && openExternalUrl(url)}
      icon={ExternalLinkSite}
      buttonHeight="tall"
    />
  ) : null

function getIsFreeOffer(offer: FavoriteOfferResponse): boolean {
  if (typeof offer.price === 'number') {
    return offer.price === 0
  }
  if (typeof offer.startPrice === 'number') {
    return offer.startPrice === 0
  }
  return false
}

function getHasEnoughCredit(offer: FavoriteOfferResponse, credit: Credit): boolean {
  if (typeof offer.price === 'number') {
    return credit.amount >= offer.price
  }
  if (typeof offer.startPrice === 'number') {
    return credit.amount >= offer.startPrice
  }
  return false
}

const { width: windowWidth } = Dimensions.get('window')
const imageWidth = getSpacing(16)

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))({ marginHorizontal: getSpacing(6) })

const columnPadding = 4
const columnMargin = 2 * 6

const Column = styled.View({
  width: windowWidth - getSpacing(columnMargin + columnPadding) - imageWidth,
})

const Row = styled.View({ flexDirection: 'row', alignItems: 'center' })

const ButtonContainer = styled.View({
  minWidth: getSpacing(30),
  maxWidth: getSpacing(70),
  width: '47%',
})

const ButtonsRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: getSpacing(6),
})

const Name = styled(Typo.ButtonText)({})

const Distance = styled(Typo.Body)({ textAlign: 'right', color: ColorsEnum.GREY_DARK })

const Body = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })
