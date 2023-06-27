import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useAddFavorite } from 'features/favorites/api'
import { getRecommendationEndpoint } from 'features/home/api/helpers/getRecommendationEndpoint'
import { getRecommendationParameters } from 'features/home/api/useHomeRecommendedHits'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getOfferById } from 'features/offer/api/useOffer'
import { Cards } from 'features/shake/Cards'
import { RoundedButtonLikePass } from 'features/shake/RoundedButtonLikePass'
import { useGeolocation } from 'libs/geolocation'
import { useHomeRecommendedIdsMutation } from 'libs/recommendation/useHomeRecommendedIdsMutation'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ShakeChoice = () => {
  const { navigate } = useNavigation<UseNavigationType>()
  const { user } = useAuthContext()
  const [offer, setOffer] = useState<OfferResponse>()
  const { userPosition: position } = useGeolocation()
  const recommendationEndpoint = getRecommendationEndpoint({
    userId: user?.id,
    position,
    modelEndpoint: undefined,
  })
  const [recommendedIds, setRecommendedIds] = useState<string[]>()
  const { mutate: getRecommendedIds } = useHomeRecommendedIdsMutation()
  const subcategoryLabelMapping = useSubcategoryLabelMapping()

  useEffect(() => {
    if (!recommendationEndpoint) return
    const requestParameters = getRecommendationParameters(undefined, subcategoryLabelMapping)
    getRecommendedIds(
      { ...requestParameters, endpointUrl: recommendationEndpoint },
      {
        onSuccess: (response) => setRecommendedIds(response.playlist_recommended_offers),
      }
    )
  }, [getRecommendedIds, recommendationEndpoint, subcategoryLabelMapping])

  useEffect(() => {
    if (recommendedIds && recommendedIds.length > 0)
      getOfferById(Number(recommendedIds[0])).then((response) => setOffer(response))
  }, [recommendedIds])

  const { mutate: addFavorite } = useAddFavorite({})

  if (offer) {
    const OFFERS = [
      {
        uri: offer.image?.url,
        distance: '100km',
        categoryLabel: 'Théâtre',
      },
      {
        uri: 'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/test_image_2.png',
        distance: '100km',
        categoryLabel: 'Théâtre',
      },
      {
        uri: 'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/thumbs/mediations/test_image_1_bis.jpg',
        distance: '100km',
        categoryLabel: 'Théâtre',
      },
    ]

    return (
      <React.Fragment>
        <PageHeaderSecondary title="La sélection mystère" color="white" />
        <Container>
          <Spacer.Column numberOfSpaces={10} />
          {!!offer.image && <Cards cards={OFFERS} />}
          <Spacer.Column numberOfSpaces={6} />
          <StyledTitle3>{offer?.name}</StyledTitle3>
          <Spacer.Column numberOfSpaces={6} />
          {/* <LocationCaption venue="La boétie" isDigital={false} /> */}
          <Spacer.Column numberOfSpaces={10} />
          <ButtonContainer>
            <RoundedButtonLikePass
              iconName="close"
              onPress={() => navigate('ShakeEnd')}
              accessibilityLabel="Refuser l’offre"
            />
            <Spacer.Row numberOfSpaces={5} />
            <ButtonTertiaryContainer>
              <ButtonTertiaryBlack
                inline
                wording="Voir l’offre"
                onPress={() => navigate('Offer', { id: offer.id, from: 'ShakeChoice' })}
                buttonHeight="extraSmall"
              />
            </ButtonTertiaryContainer>
            <Spacer.Row numberOfSpaces={5} />
            <RoundedButtonLikePass
              iconName="favorite"
              onPress={() => addFavorite({ offerId: offer.id })}
              accessibilityLabel="Mettre en favoris"
            />
          </ButtonContainer>
          <Spacer.BottomScreen />
        </Container>
      </React.Fragment>
    )
  }
  return null
}

const Container = styled.View({
  width: '100%',
  borderRadius: getSpacing(4),
  padding: getSpacing(6),
})

const ButtonContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
})

const ButtonTertiaryContainer = styled.View(({ theme }) => ({
  justifyContent: 'center',
  border: theme.buttons.secondary.borderWidth,
  borderRadius: theme.borderRadius.button,
  paddingHorizontal: getSpacing(6),
  paddingVertical: getSpacing(2),
}))

const StyledTitle3 = styled(Typo.Title3).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})
