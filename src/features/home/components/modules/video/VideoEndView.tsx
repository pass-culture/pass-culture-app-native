import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ButtonWithCaption } from 'features/home/components/modules/video/ButtonWithCaption'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { Offers } from 'ui/svg/icons/Offers'
import { Spacer, getSpacing } from 'ui/theme'

export const VideoEndView: React.FC<{
  onPressReplay: () => void
  onPressSeeOffer: () => void
  offer: Offer
  style: StyleProp<ViewStyle>
  videoThumbnail: string
}> = ({ onPressReplay, offer, onPressSeeOffer, style, videoThumbnail }) => {
  const prePopulateOffer = usePrePopulateOffer()
  const mapping = useCategoryIdMapping()

  return (
    <VideoEndViewContainer style={style}>
      <Thumbnail source={{ uri: videoThumbnail }} style={style}>
        <BlackView>
          <ButtonsContainer>
            <ButtonWithCaption
              onPress={onPressReplay}
              accessibilityLabel="Revoir la vidéo"
              wording={'Revoir'}
              icon={StyledReplayIcon}
            />
            <Spacer.Row numberOfSpaces={9} />
            <ButtonWithCaption
              onPress={() => {
                onPressSeeOffer()
                prePopulateOffer({
                  ...offer.offer,
                  offerId: +offer.objectID,
                  categoryId: mapping[offer.offer.subcategoryId],
                })
              }}
              navigateTo={{
                screen: 'Offer',
                params: { id: offer.objectID },
              }}
              accessibilityLabel="Voir l’offre"
              wording="Voir l’offre"
              icon={StyledOffersIcon}
            />
          </ButtonsContainer>
        </BlackView>
      </Thumbnail>
    </VideoEndViewContainer>
  )
}

const VideoEndViewContainer = styled.View({
  position: 'absolute',
})

const ButtonsContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
})

const StyledReplayIcon = styled(ArrowAgain).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const StyledOffersIcon = styled(Offers).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``

const Thumbnail = styled.ImageBackground({
  // the overflow: hidden allow to add border radius to the image
  // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
})

const BlackView = styled.View({
  backgroundColor: 'rgba(22, 22, 23, 0.48)',
  height: '100%',
  justifyContent: 'center',
})
