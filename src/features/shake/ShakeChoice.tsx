import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { Animated, Easing } from 'react-native'
import styled from 'styled-components/native'
import { DefaultTheme } from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useAddFavorite } from 'features/favorites/api'
import { getRecommendationEndpoint } from 'features/home/api/helpers/getRecommendationEndpoint'
import { getRecommendationParameters } from 'features/home/api/useHomeRecommendedHits'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getOfferById } from 'features/offer/api/useOffer'
import { LocationCaption } from 'features/offer/components/LocationCaption'
import { Cards } from 'features/shake/Cards'
import { RoundedButtonLikePass } from 'features/shake/RoundedButtonLikePass'
import { useGeolocation } from 'libs/geolocation'
import { useHomeRecommendedIdsMutation } from 'libs/recommendation/useHomeRecommendedIdsMutation'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { theme } from 'theme'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { BackButton } from 'ui/components/headers/BackButton'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ShakeChoice = () => {
  const [hasPickedFavorite, setHasPickedFavorite] = useState(false)
  const { replace, navigate } = useNavigation<UseNavigationType>()
  const { user } = useAuthContext()
  const [offers, setOffers] = useState<OfferResponse[]>()
  const { userPosition: position } = useGeolocation()
  const recommendationEndpoint = getRecommendationEndpoint({
    userId: user?.id,
    position,
    modelEndpoint: undefined,
  })
  const [recommendedIds, setRecommendedIds] = useState<string[]>()
  const { mutate: getRecommendedIds } = useHomeRecommendedIdsMutation()
  const subcategoryLabelMapping = useSubcategoryLabelMapping()

  const scaleFavoriteIconAnimatedValueRef = useRef(new Animated.Value(1))
  const { headerTransition } = useOpacityTransition()

  useEffect(() => {
    if (!recommendationEndpoint) return
    const requestParameters = getRecommendationParameters(
      { isRecoShuffled: true },
      subcategoryLabelMapping
    )

    getRecommendedIds(
      { ...requestParameters, endpointUrl: recommendationEndpoint },
      {
        onSuccess: (response) => setRecommendedIds(response.playlist_recommended_offers),
      }
    )
  }, [getRecommendedIds, recommendationEndpoint, subcategoryLabelMapping])

  useEffect(() => {
    if (recommendedIds && recommendedIds.length > 5) {
      getOfferById(Number(recommendedIds[0])).then((response) =>
        setOffers((offers) => (offers ? [...offers, response] : [response]))
      )
      getOfferById(Number(recommendedIds[1])).then((response) =>
        setOffers((offers) => (offers ? [...offers, response] : [response]))
      )
      getOfferById(Number(recommendedIds[2])).then((response) =>
        setOffers((offers) => (offers ? [...offers, response] : [response]))
      )
      getOfferById(Number(recommendedIds[3])).then((response) =>
        setOffers((offers) => (offers ? [...offers, response] : [response]))
      )
      getOfferById(Number(recommendedIds[4])).then((response) =>
        setOffers((offers) => (offers ? [...offers, response] : [response]))
      )
    }
  }, [recommendedIds])

  const { mutate: addFavorite, isLoading: addFavoriteIsLoading } = useAddFavorite({})

  if (offers && offers?.length !== 0) {
    const onLikePress = () => {
      let shouldRedirect = 0
      if (offers.length === 1) shouldRedirect = 1
      animateIcon(scaleFavoriteIconAnimatedValueRef.current)
      addFavorite({ offerId: offers[0].id })
      setOffers((offers) => (offers ? offers.slice(1) : []))
      setHasPickedFavorite(true)

      if (shouldRedirect) {
        replace('ShakeEndWithFavorite')
      }
    }

    const onPassPress = () => {
      let shouldRedirect = 0
      if (offers.length === 1) shouldRedirect = 1
      setOffers((offers) => (offers ? offers.slice(1) : []))

      if (shouldRedirect) {
        if (hasPickedFavorite) {
          replace('ShakeEndWithFavorite')
        } else {
          replace('ShakeEnd')
        }
      }
    }

    return (
      <React.Fragment>
        <Spacer.TopScreen />
        <Container>
          <BackButtonContainer testID="back-button-container">
            <BackButton />
          </BackButtonContainer>
          <Spacer.Column numberOfSpaces={5} />
          <Title>{'La sélection mystère'}</Title>
          <Spacer.Column numberOfSpaces={10} />
          <Cards cards={offers} />
          <Spacer.Column numberOfSpaces={6} />
          <StyledTitle3>{offers[0].name}</StyledTitle3>
          <Spacer.Column numberOfSpaces={4} />
          <LocationCaption venue={offers[0].venue} isDigital={offers[0].isDigital} />
          <Spacer.Column numberOfSpaces={10} />
          <Spacer.Flex />
          <ButtonContainer>
            <RoundedButtonLikePass
              iconName="close"
              onPress={onPassPress}
              accessibilityLabel="Refuser l’offre"
            />
            <Spacer.Row numberOfSpaces={5} />
            <ButtonTertiaryContainer>
              <ButtonTertiaryBlack
                inline
                wording="Voir l’offre"
                onPress={() => navigate('Offer', { id: offers[0].id, from: 'ShakeChoice' })}
                buttonHeight="extraSmall"
              />
            </ButtonTertiaryContainer>
            <Spacer.Row numberOfSpaces={5} />
            <RoundedButtonLikePass
              animationState={{
                iconBackgroundColor: headerTransition.interpolate(
                  iconBackgroundInterpolation(theme)
                ),
                iconBorderColor: headerTransition.interpolate(iconBorderInterpolation(theme)),
                transition: headerTransition,
              }}
              scaleAnimatedValue={scaleFavoriteIconAnimatedValueRef.current}
              iconName={'favorite'}
              onPress={onLikePress}
              disabled={addFavoriteIsLoading}
            />
          </ButtonContainer>
          <Spacer.Column numberOfSpaces={5} />
          <Spacer.BottomScreen />
        </Container>
      </React.Fragment>
    )
  }
  return null
}

const iconBackgroundInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: [theme.colors.white, 'rgba(255, 255, 255, 0)'],
})

const iconBorderInterpolation = (theme: DefaultTheme) => ({
  inputRange: [0, 1],
  outputRange: [theme.colors.greyDark, 'rgba(255, 255, 255, 0)'],
  easing: Easing.bezier(0, 1, 0, 1),
})

function animateIcon(animatedValue: Animated.Value): void {
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1.3,
      duration: 200,
      useNativeDriver: false,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }),
  ]).start()
}

const Container = styled.View({
  flex: 1,
  padding: getSpacing(6),
  height: '100%',
})

const BackButtonContainer = styled.View({
  flexDirection: 'row',
})

const Title = styled(Typo.Title3)({
  textAlign: 'center',
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
