import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Image, useWindowDimensions } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { BookingsTab } from 'features/bookings/enum'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import thumbs from 'features/reactions/images/thumbs.png'
import { OfferImageBasicProps } from 'features/reactions/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { AppModal } from 'ui/components/modals/AppModal'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

type Props = {
  visible: boolean
  closeModal: (triggerUpdate?: boolean) => void
  offerImages: OfferImageBasicProps[]
}

export const ReactionRedirectionModal: FunctionComponent<Props> = ({
  visible,
  closeModal,
  offerImages,
}) => {
  const { height } = useWindowDimensions()
  const { top } = useCustomSafeInsets()
  const { navigate } = useNavigation<UseNavigationType>()

  const onPressRedirection = () => {
    closeModal()
    navigate('Bookings', { activeTab: BookingsTab.COMPLETED })
  }

  const offerImagesWithUrl = offerImages.filter((offerImage) => offerImage.imageUrl !== '') ?? []

  return (
    <AppModal
      testID="reactionChoiceModal"
      visible={visible}
      title="Choix de réaction"
      maxHeight={height - top}
      rightIcon={Close}
      onRightIconPress={() => closeModal(true)}
      rightIconAccessibilityLabel="Fermer la modale"
      fixedModalBottom={
        <ButtonsContainer gap={4}>
          <ButtonPrimary wording="Donner mon avis" onPress={onPressRedirection} />
          <ButtonTertiaryBlack
            wording="Plus tard"
            icon={ClockFilled}
            onPress={() => closeModal(true)}
          />
        </ButtonsContainer>
      }>
      <React.Fragment>
        {offerImagesWithUrl.length > 0 ? (
          <GradientContainer>
            <Spacer.Column numberOfSpaces={6} />
            {offerImagesWithUrl.length > 4 ? (
              <ImagesContainerGradient testID="offerImagesGradient" />
            ) : null}
            <ImagesContainer gap={2} testID="imagesContainer">
              {offerImages?.map((offerImage) => (
                <OfferImage
                  key={offerImage.imageUrl}
                  imageUrl={offerImage.imageUrl}
                  categoryId={offerImage.categoryId}
                  withContainerStroke={offerImage.imageUrl === ''}
                  withShadow={false}
                />
              ))}
            </ImagesContainer>
          </GradientContainer>
        ) : (
          <ThumbsImageContainer testID="thumbsImage">
            <ThumbsImage source={thumbs} resizeMode="cover" />
          </ThumbsImageContainer>
        )}

        <Spacer.Column numberOfSpaces={6} />
        <StyledTitle3 {...getHeadingAttrs(2)}>
          Qu’as-tu pensé de tes dernières réservations&nbsp;?
        </StyledTitle3>
        <Spacer.Column numberOfSpaces={6} />
      </React.Fragment>
    </AppModal>
  )
}

const ButtonsContainer = styled(ViewGap)({
  alignItems: 'center',
  marginTop: getSpacing(2),
})

const GradientContainer = styled.View({
  width: '100%',
})

const ImagesContainer = styled(ViewGap)({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
})

const ImagesContainerGradient = styled(LinearGradient).attrs({
  colors: [
    '#FFF',
    'rgba(255, 255, 255, 0.75)',
    'rgba(255, 255, 255, 0.00)',
    'rgba(255, 255, 255, 0.00)',
    'rgba(255, 255, 255, 0.75)',
    '#FFF',
  ],
  locations: [0, 0.12, 0.25, 0.75, 0.87, 1], // Positions des transitions
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
})({
  width: '100%',
  height: '100%',
  position: 'absolute',
  zIndex: 2,
})

const ThumbsImageContainer = styled.View({
  width: '100%',
  height: 124,
  justifyContent: 'center',
  alignItems: 'center',
})

const ThumbsImage = styled(Image)({
  width: 210,
  height: '100%',
  marginTop: getSpacing(4),
})

const StyledTitle3 = styled(Typo.Title3)({
  textAlign: 'center',
})
