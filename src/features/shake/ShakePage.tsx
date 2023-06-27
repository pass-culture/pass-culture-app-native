import React, { useState } from 'react'
import { useEffect } from 'react'
import RNShake from 'react-native-shake'
import styled from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { getRecommendationEndpoint } from 'features/home/api/helpers/getRecommendationEndpoint'
import { getRecommendationParameters } from 'features/home/api/useHomeRecommendedHits'
import { getOfferById } from 'features/offer/api/useOffer'
import { Cards } from 'features/shake/Cards'
import { RoundedButtonLikePass } from 'features/shake/RoundedButtonLikePass'
import { useGeolocation } from 'libs/geolocation'
import { useHomeRecommendedIdsMutation } from 'libs/recommendation/useHomeRecommendedIdsMutation'
import { useSubcategoryLabelMapping } from 'libs/subcategories/mappings'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Close } from 'ui/svg/icons/Close'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const ShakePage = () => {
  const { user } = useAuthContext()
  const { showModal, hideModal, visible } = useModal(true)
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
    const subscription = RNShake.addListener(() => {
      showModal()
    })

    return () => {
      subscription.remove()
    }
  }, [showModal])

  useEffect(() => {
    if (!recommendationEndpoint) return
    const requestParameters = getRecommendationParameters(undefined, subcategoryLabelMapping)
    getRecommendedIds(
      { ...requestParameters, endpointUrl: recommendationEndpoint },
      {
        onSuccess: (response) => setRecommendedIds(response.playlist_recommended_offers),
      }
    )
  }, [getRecommendedIds, recommendationEndpoint, subcategoryLabelMapping, visible])

  useEffect(() => {
    if (recommendedIds && recommendedIds.length > 0)
      getOfferById(Number(recommendedIds[0])).then((response) => setOffer(response))
  }, [recommendedIds])

  if (visible && !!offer) {
    return (
      <Container>
        <Spacer.TopScreen />
        <ModalHeader
          title={'La sélection mystère'}
          rightIconAccessibilityLabel="Fermer la modale"
          rightIcon={Close}
          onRightIconPress={hideModal}
        />
        <Spacer.Column numberOfSpaces={10} />
        <Cards categoryLabel="Théâtre" distance="100km" uri={offer.image?.url} />
        <Spacer.Column numberOfSpaces={6} />
        <StyledTitle3>{offer?.name}</StyledTitle3>
        <Spacer.Column numberOfSpaces={6} />
        {/* <LocationCaption venue="La boétie" isDigital={false} /> */}
        <Spacer.Column numberOfSpaces={10} />
        <ButtonContainer>
          <RoundedButtonLikePass
            iconName="close"
            onPress={hideModal}
            accessibilityLabel="Refuser l’offre"
          />
          <Spacer.Row numberOfSpaces={5} />
          <ButtonTertiaryContainer>
            <ButtonTertiaryBlack
              inline
              wording="Voir l’offre"
              onPress={hideModal}
              buttonHeight="extraSmall"
            />
          </ButtonTertiaryContainer>
          <Spacer.Row numberOfSpaces={5} />
          <RoundedButtonLikePass
            iconName="favorite"
            onPress={hideModal}
            accessibilityLabel="Mettre en favoris"
          />
        </ButtonContainer>
        <Spacer.BottomScreen />
      </Container>
    )
  }
  return null
}

const Container = styled.View({
  width: '100%',
  backgroundColor: '#fff',
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
