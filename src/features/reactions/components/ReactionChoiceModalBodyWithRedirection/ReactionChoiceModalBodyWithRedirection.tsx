import React, { FunctionComponent } from 'react'
// eslint-disable-next-line no-restricted-imports
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { OfferImageBasicProps } from 'features/reactions/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteIllustrationUrls } from 'shared/illustrations/remoteIllustrations'
import { RemoteIllustration } from 'ui/components/RemoteIllustration'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { MultipleThumbs } from 'ui/svg/icons/MultipleThumbs'
import { Typo } from 'ui/theme'
import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

type Props = {
  offerImages: OfferImageBasicProps[]
}

export const ReactionChoiceModalBodyWithRedirection: FunctionComponent<Props> = ({
  offerImages,
}) => {
  const enableNewVisionUi = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_VISION_UI)

  const offerImagesWithUrl = offerImages.filter((offerImage) => offerImage.imageUrl !== '')

  const renderIllutration = () => {
    if (enableNewVisionUi)
      return (
        <IllustrationContainer>
          <RemoteIllustration
            url={remoteIllustrationUrls.ratingHandsSmall}
            backgroundColor="information04"
            size="s"
          />
        </IllustrationContainer>
      )

    return (
      <ThumbsImageContainer testID="thumbsImage">
        <MultipleThumbs />
      </ThumbsImageContainer>
    )
  }

  return (
    <Container gap={6}>
      {offerImagesWithUrl.length > 0 ? (
        <GradientContainer>
          {offerImagesWithUrl.length > 4 ? (
            <ImagesContainerGradient testID="offerImagesGradient" />
          ) : null}
          <ImagesContainer gap={2} testID="imagesContainer">
            {offerImages.map((offerImage) => (
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
        renderIllutration()
      )}

      <StyledTitle3 {...getTextSemanticAttrs(2)}>
        Qu’as-tu pensé de tes dernières réservations&nbsp;?
      </StyledTitle3>
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const GradientContainer = styled.View(({ theme }) => ({
  width: '100%',
  marginTop: theme.designSystem.size.spacing.xl,
}))

const ImagesContainer = styled(ViewGap)({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
})

const ImagesContainerGradient = styled(LinearGradient).attrs<{ colors?: string[] }>(
  ({ theme }) => ({
    colors: [
      theme.designSystem.color.background.gradientMaximum,
      theme.designSystem.color.background.gradientMiddle,
      theme.designSystem.color.background.gradientMinimum,
      theme.designSystem.color.background.gradientMinimum,
      theme.designSystem.color.background.gradientMiddle,
      theme.designSystem.color.background.gradientMaximum,
    ],
    locations: [0, 0.12, 0.25, 0.75, 0.87, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  })
)({
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

const IllustrationContainer = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
})

const StyledTitle3 = styled(Typo.Title3)({
  textAlign: 'center',
})
